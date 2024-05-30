import axios from "axios";
const baseUrl = "http://localhost:8080/api/users";

/**
 * Separate Module for communication with the Backend.
 * @returns {Promise<any>}
 */
const signIn = (username: string, password: string) => {
    const request = axios({
        method: "post",
        url: `${baseUrl}/login`,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        data: {
            username: username,
            password: password,
        },
    });

    return request.then((response) => response.data);
};

const signOut = (token: string, uuid: string) => {
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

    return request.then((response) => response.data);
};

const signUp = (
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
            "Access-Control-Allow-Origin": "*",
        },
        data: {
            email: email,
            username: username,
            password: password,
            bggUsername: bggUsername !== "" ? bggUsername : null,
        },
    });

    return request.then((response) => response.data);
};

export default { signIn, signOut, signUp };
