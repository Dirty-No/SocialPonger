import Vue from "vue";
import { chatStore } from "@/store/";
import { User } from "@/models/User";
import { Channel } from "@/models/Channel";
import { Message } from "@/models/Message";
import { ChanConnection } from "@/models/ChanConnection";
import { ChanInvitation } from "@/models/ChanInvitation";
import { Relation, RelationType } from "@/models/Relation";

class Chat extends Vue {
	async whoAmI(): Promise<User | undefined> {
		let ret;
		await this.api.get("/me", undefined, (r: { data: User }) => {
			chatStore.updateMe(r.data);
			ret = chatStore.me;
		});
		return ret;
	}

	async createChannel(chan: Channel) {
		await this.api.post("/channels", chan, undefined, (chan: Channel) => {
			this.joinChannel(chan);
		});
	}

	async joinChannel(chan: Channel, password?: string, onSuccess?: Function): Promise<Channel | undefined> {
		let ret: Channel | undefined;
		await this.api.post(
			"/channels/" + chan.id + "/join",
			undefined,
			{ password },
			(d = { data: { channel: new Channel() } }) => {
				ret = d.data.channel;
			},
		);
		if (ret !== undefined) {
			await this.api.get("/channels/" + chan.id, undefined, (d = { data: new Channel() }) => {
				ret = d.data;
				chatStore.updateCurrentChannel(d.data);
				this.getChanConnections();
			});
			Vue.prototype.$socket.getSocket()?.emit("JC", ret.id);
			this.$nuxt.$emit("updateChannels");
			onSuccess?.();
		}
		return ret;
	}

	async leaveChannel(chan: Channel) {
		await this.api.post("/channels/" + chan.id + "/leave", undefined, undefined, () => {
			if (chan.id === chatStore.currentChannel.id) {
				chatStore.resetCurrentChannel();
			}
			chatStore.leaveChannel(chan.id);
		});
	}

	async getVisibleChannels() {
		await this.api.get("/channels", { page: 1, per_page: 100 }, (r: { data: Channel[] }) => {
			if (r.data instanceof Array) chatStore.updateVisibleChannels(r.data);
		});
	}

	async getMyChannels() {
		const id = await chatStore.me.id;
		await this.api.get(
			"/users/" + id + "/chan_connections",
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				chatStore.updateMyChannels([] as Channel[]);
				for (const connection of r.data) {
					chatStore.pushMyChannels(connection.channel);
				}
			},
		);
	}

	async getChanConnections(): Promise<Array<ChanConnection> | undefined> {
		let ret: Array<ChanConnection> | undefined;
		if (chatStore.currentChannel.id === undefined) return ret;
		await this.api.get(
			"/channels/" + chatStore.currentChannel.id + "/chan_connections",
			{ page: 1, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				const connections = [] as ChanConnection[];
				r.data.forEach((connection: ChanConnection) => {
					if (connection.user.id === chatStore.me.id) {
						chatStore.updateMyRole(connection.role);
					}
					connections.push(connection);
				});
				ret = connections;
				chatStore.updateChanConnections(connections);
			},
		);
		return ret;
	}

	async getChanInvitations(): Promise<Array<ChanInvitation> | undefined> {
		let ret: Array<ChanInvitation> | undefined;
		await this.api.get("/invitations", { page: 1, per_page: 100 }, (r: { data: ChanInvitation[] }) => {
			const invitations = [] as ChanInvitation[];
			r.data.forEach((invitation: ChanInvitation) => {
				invitations.push(invitation);
			});
			ret = invitations;
			chatStore.updateChanInvitations(invitations);
		});
		return ret;
	}

	async getRelations(): Promise<Array<Relation> | undefined> {
		let ret: Array<Relation> | undefined;
		await this.api.get("/relations", { page: 1, per_page: 100 }, (r: { data: Relation[] }) => {
			const relations = [] as Relation[];
			r.data.forEach((relation: Relation) => {
				if (relation.type === RelationType.BLOCK) chatStore.pushBlockedUsers(relation);
				else relations.push(relation);
			});
			ret = relations;
			chatStore.updateRelations(relations);
		});
		return ret;
	}

	async addFriend(user: User): Promise<void> {
		await this.api.post("/users/" + user.id + "/invite_friend", undefined, undefined, () => {
			this.getRelations();
		});
	}

	async acceptFriend(id: number): Promise<void> {
		await this.api.post("/relations/" + id + "/accept_friend");
	}

	async removeFriend(relation: Relation): Promise<void> {
		await this.api.delete("/relations/" + relation.id);
	}

	async blockUser(user: User): Promise<void> {
		await this.api.post("/users/" + user.id + "/block", undefined, undefined, (r: { data: Relation }) => {
			this.api.get("/relations/" + r.data.id, undefined, (_r: { data: Relation }) => {
				chatStore.pushBlockedUsers(_r.data as Relation);
			});
			Vue.prototype.$socket.getSocket()?.emit("JC", chatStore.currentChannel.id);
		});
	}

	async unblockUser(user: User): Promise<void> {
		const index = chatStore.blockedUsers.findIndex((r: Relation) => r.target.id === user.id);
		if (index !== -1) {
			await this.api.delete("/relations/" + chatStore.blockedUsers[index].id, undefined, () => {
				chatStore.spliceBlockedUsers(index);
				Vue.prototype.$socket.getSocket()?.emit("JC", chatStore.currentChannel.id);
			});
		}
	}

	async getMessage(message: Message): Promise<void> {
		// check if message.user isn't blocked
		if (!chatStore.blockedUsers.find((r: Relation) => r.target.id === message.user)) {
			await this.api.get("/messages/" + message.id, undefined, (r: { data: Message }) => {
				chatStore.pushMessage(r.data);
			});
		}
	}

	async updateChannel(chan: Channel) {
		await this.api.put("/channels/" + chan.id, chan);
	}
}

declare module "vue/types/vue" {
	interface Vue {
		chat: Chat;
	}
}

Vue.prototype.chat = new Chat();
