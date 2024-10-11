import axios from "axios";
import api_address from "../config/api_address.ts";


const baseUrl = `${api_address.backend}/users`;

/**
 * Separate Module for communication with the Backend.
 * @returns {Promise<any>}
 */
const signIn = async (username: string, password: string) => {
    const request = axios({
        method: "post",
        url: `${baseUrl}/login`,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            username: username,
            password: password,
        },
    });

    const response = await request;
    return response.data;
};

const signOut = async (token: string, uuid: string) => {
    const request = axios({
        method: "post",
        url: `${baseUrl}/${uuid}/logout`,
        headers: { Authorization: `${token}` },
    });
    /* This version do not work
  const request2 = axios.post(
   `${baseUrl}/${uuid}/logout`,
   {headers: { 'Authorization':`${token}`}}
  )*/

    const response = await request;
    return response.data;
};

const signUp = async (
    email: string,
    username: string,
    password: string,
    bggUsername: string
) => {
    const request = axios({
        method: "post",
        url: `${baseUrl}`,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            email: email,
            username: username,
            password: password,
            bggUsername: bggUsername !== "" ? bggUsername : null,
        },
    });

    const response = await request;
    return response.data;
};

const changeEmail = async (token: string, uuid: string, email: string) => {
    const request = axios({
        method: "put",
        url: `${baseUrl}/${uuid}?option=email`,
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
        data: {
            email: email,
            bggUsername: null,
        },
    });

    const response = await request;
    return response.data;
};

const changeBggUsername = async (
    token: string,
    uuid: string,
    bggUsername: string
) => {
    const request = axios({
        method: "put",
        url: `${baseUrl}/${uuid}?option=bgg`,
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
        data: {
            email: null,
            bggUsername: bggUsername,
        },
    });

    const response = await request;
    return response.data;
};

const changePassword = async (
    token: string,
    uuid: string,
    oldPassword: string,
    newPassword: string
) => {
    const request = axios({
        method: "put",
        url: `${baseUrl}/${uuid}/password`,
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
        data: {
            oldPassword: oldPassword,
            newPassword: newPassword,
        },
    });

    const response = await request;
    return response.data;
};

const getUserByUuid = async (uuid: string) => {
    const request = axios({
        method: "get",
        url: `${baseUrl}/${uuid}?type=uuid`,
    });

    const response = await request;
    return response.data;
};

export default {
    signIn,
    signOut,
    signUp,
    changeEmail,
    changeBggUsername,
    changePassword,
    getUserByUuid,
};
