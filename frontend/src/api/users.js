import axios_instace from "./base.js";

export const registerUserApiRequest = async ({ username, password }) => {
    const url = "/users/register";
    const data = { username, password };
    return await axios_instace.post(url, data).catch(err => {
        console.log("registerUserAPiRequest Error:",err);
    });
}

export const userExistsApiRequest = async ({username}) => {
    const url = `/users/exists/${username}`;
    return await axios_instace.get(url).catch(err => {
        console.log("userExistsApiRequest Error:",err);
    });
};

export const loginUserApiRequest = async ({username, password, onFail}) => {
    const url = "/users/login";
    const data = {username, password};
    return await axios_instace.post(url, data).catch(err => {
        console.log("loginUserApiRequest Error:",err);
        onFail(err?.response?.data?.error || "Unknown Error");
    });
};

export const logoutUserApiRequest = async ({onFail}) => {
    const url = "/users/logout";
    return await axios_instace.post(url).catch(err => {
        console.log("logoutUserApiRequest Error:",err);
        onFail(err?.response?.data?.error || "Unknown Error");
    });
};