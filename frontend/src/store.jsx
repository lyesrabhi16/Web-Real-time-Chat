import { create } from "zustand";
import axios_instace from "./api/base.js";
import { validateUser } from "./utils/helpers.js";

export const useAppStore = create((set, get) => ({
	user: validateUser(JSON.parse(sessionStorage.getItem("user")))
		? JSON.parse(sessionStorage.getItem("user"))
		: null,
	setUser: (user) => {
		console.log("Setting user", user);
		// validate user
		if (validateUser(user)) {
			sessionStorage.setItem("user", JSON.stringify(user));
			set({ user: user });
		} else {
			console.log("Invalid user object", user);
		}
	},
	fetchUser: async () => {
		if (!localStorage.getItem("token")) {
			return;
		}

		const url = "/users/current";
		let error = false;
		const response = await axios_instace.get(url).catch((err) => {
			console.log("fetchUser Error:", err);
			error = true;
		});
		if (error) {
			return;
		}

		get().setUser(response.data);
	},
}));

export default useAppStore;
