<template>
	<div class="v-full h-full">
		<div class="text-white flex flex-col pl-8 pr-8 gap-4">
			<div class="flex flex-col">
				<p class="ml-2">Channel name:</p>
				<div class="area-chan-name p-2">
					<input
						id="textarea-chan-name"
						v-model="channel.name"
						maxlength="20"
						class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
						placeholder="Enter channel name..."
					/>
				</div>
			</div>
			<select id="type-select" class="text-black p-2" name="pets" @change="selectCategory($event)">
				<option value="PUBLIC">public</option>
				<option value="PRIVATE">private</option>
				<option value="PASSWORD">protected</option>
			</select>
			<div v-if="selectedType === 1">
				<div class="flex flex-col">
					<p class="ml-2">Enter the password:</p>
					<div class="area-chan-name p-2">
						<input
							id="textarea-password"
							v-model="channel.password"
							type="password"
							maxlength="20"
							class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
							placeholder="Password..."
						/>
					</div>
				</div>
			</div>
			<button class="validate" @click.prevent="createChannel">Create the channel {{ channel.name }}</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel, ChannelType } from "@/models/Channel";
import { store } from "@/store";

export default Vue.extend({
	name: "ChannelCreation",
	data() {
		return {
			channel: { name: "", type: ChannelType.PUBLIC } as Channel,
			selectedType: ChannelType.PUBLIC,
		};
	},
	methods: {
		selectCategory(event: Event) {
			this.selectedType = (ChannelType as any)[(event.target as HTMLInputElement).value];
			this.channel.type = this.selectedType;
			if (this.selectedType !== ChannelType.PASSWORD) this.channel.password = "";
		},
		createChannel() {
			this.api.post("/channels", this.channel, undefined, (r: { data: Channel }) => {
				store.channel.joinChannel(r.data);
				store.channel.pushMyChannels(r.data);
				store.channel.pushChannel(r.data);
				this.$modal.hide("create_channel");
			});
		},
	},
});
</script>

<style scoped>
.area-chan-name {
	border: none;
	border-bottom: 1px solid #333;
	background-color: #1c2638;
	border-radius: 7px;
	outline: none;
	width: 80%;
	padding-top: 12px;
	resize: none;
	font: 1em "Open Sans", sans-serif;
	display: inline;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.validate {
	overflow: hidden;
	color: black;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 5px;
	text-align: center;
	background-color: #cecece;
	display: inline;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>