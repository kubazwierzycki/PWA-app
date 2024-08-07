import apiAddress from "../config/api_address.json"
import axios from "axios";


export interface PutPlayroom {
    gameId: string
    game: string
    isGlobalTimer: boolean
    timer: number
}


const baseApiAddress: string = apiAddress.backend + '/playrooms';

/**
 * POST creating empty playroom
 * @returns {Promise<string>} uuid of created playroom if successful
 */
export const createPlayroom = async (): Promise<string> => {
    const request = axios({
        method: "post",
        url: baseApiAddress,
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request;
    if (response.status == 200) {
        return response.data.uuid;
    }
    return "";
}

/**
 * PUT update playroom entity after playroom is ready
 * @param {string} id - uuid of the playroom assigned by server
 * @param {@link PutPlayroom} body - request body with playroom details
 * @returns {Promise<boolean>} feedback if request was successful
 */
export const updatePlayroom = async (id: string, body: PutPlayroom):Promise<boolean> => {
    const request = axios({
        method: "put",
        url: baseApiAddress + '/' + id,
        headers: {
            "Content-Type": "application/json",
        },
        data: body
    });

    const response = await request;
    console.log(response.status)
    return response.status === 201;
}
