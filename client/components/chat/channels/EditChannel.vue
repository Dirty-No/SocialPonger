<template>
	<client-only>
		<div id="edit-channel" class="w-full">
			<div class="flex flex-col">
				<div id="chan-name">
					<b>Name:</b>
					<div class="w-full truncate">
						{{ currentConnection.channel.name }}
					</div>
				</div>
				<div id="chan-type">
					<b>Type:</b>
					<p v-if="currentConnection.channel.type === ChannelType.PUBLIC">Public</p>
					<p v-if="currentConnection.channel.type === ChannelType.PRIVATE">Private</p>
					<p v-if="currentConnection.channel.type === ChannelType.PASSWORD">Protected</p>
				</div>
			</div>
			<button v-if="isAdmin" id="edit-button" @click="editChan">edit</button>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";
import { ChannelType } from "@/models/Channel";
import { ChannelRole } from "@/models/ChanConnection";

export default Vue.extend({
	name: "EditChannel",
	data() {
		return {
			get currentConnection() {
				return store.channel.currentConnection;
			},
			get ChannelType() {
				return ChannelType;
			},
			get isAdmin(): boolean {
				return this.currentConnection.role === ChannelRole.OWNER;
			},
		};
	},
	methods: {
		editChan() {
			this.$modal.show("edit_channel");
		},
	},
});
</script>

<style>
#edit-channel {
	font: 1em "Open Sans", sans-serif;
	color: #d3d3d3;
	padding: 10px;
	background-color: #333;
}

#edit-button {
	font: 0.75em "Open Sans", sans-serif;
	border-radius: 5px;
	color: #222;
	font-weight: bold;
	background-color: #666;
	margin-left: auto;
	margin-right: 0;
	display: block;
	padding: 0.25em 0.5em;
}

p {
	display: inline;
}
</style>
