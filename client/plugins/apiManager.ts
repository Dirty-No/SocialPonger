import Vue from "vue";
import axios from "axios";

class ApiClass extends Vue {
	async post(route: string, data?: any, params?: Object, onSuccess?: Function, onError?: Function) {
		await axios
			.post(process.env.apiBaseUrl + route, data, { withCredentials: true, params })
			.then((response) => {
				onSuccess?.(response);
			})
			.catch((err) => {
				// error.response.data.message
				onError?.(err);
			});
	}

	async get(route: string, params?: Object, onSuccess?: Function, onError?: Function) {
		await axios
			.get(process.env.apiBaseUrl + route, { withCredentials: true, params })
			.then((response) => {
				onSuccess?.(response);
			})
			.catch((err) => {
				onError?.(err);
			});
	}
}

declare module "vue/types/vue" {
	interface Vue {
		api: ApiClass;
	}
}

Vue.prototype.api = new ApiClass();