import apiAddress from "../config/api_address.json"
import axios from "axios";


const baseApiAddress: string = apiAddress.backend + '/playrooms';

/**
 *
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