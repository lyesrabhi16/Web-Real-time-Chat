import axios from "axios";

const axios_instace = axios.create(
	{
		baseURL: "http://localhost:5000/api/",
		headers: {
			"Content-Type": "application/json",
            "Accept": "application/json",
			"Authorization": `Token ${localStorage.getItem("token")}`,
		},
	},
	{ withCredentials: true }
);

axios_instace.interceptors.request.use(
	(v) => {
		console.log("Request sent", v);
		return v;
	},
	(e) => {
		console.log("Request error", e);
		return Promise.reject(e);
	}
);

axios_instace.interceptors.response.use(
	(v) => {
		console.log("Response received", v);
		return v;
	},
	(e) => {
		console.log("Response error", e);
		return Promise.reject(e);
	}
);
export default axios_instace;
