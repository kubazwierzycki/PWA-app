import axios from "axios";
import api_address from "../config/api_address.ts";

const baseUrl = `${api_address.backend}/gameplay`;

export interface Gameplay {
    "uuid" : string
    "date": string
    "winner": string
    "game": string
    "players": string[]
}


/**
 * Get gameplays for specific user
 */
const getGameplays = async (userId: string) : Promise<Gameplay[]> => {
    const request = axios({
        method: "get",
        url: `${baseUrl}/player/${userId}`,
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request;
    const gameplays : Gameplay[] = response.data.gameplays;
    return gameplays;
};

export default{
    getGameplays
}
