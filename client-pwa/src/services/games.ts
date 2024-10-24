
import axios from "axios";
import api_address from "../config/api_address";
const baseUrl = api_address.backend;

/**
 * @param {number} time - suggested time in seconds
 * @param {boolean} turnBased - timer type
 */
export interface SuggestedTimer{
    "time": number,
    "turnBased":boolean
}

/**
 * @param {gameId} string - BGG game id
 * @returns {Promise<SuggestedTimer>} The most used timer for selected game
 */
const getSuggestedTimer = async (gameId: string) : Promise<SuggestedTimer> => {
    
    const request = axios({
        method: "get",
        url: `${baseUrl}/games/${gameId}?type=id`,
    });

    const response = await request;
    const suggestedTimer : SuggestedTimer = { "time": response.data.time, "turnBased": response.data.turnBased};
    console.log(suggestedTimer);
    
    return suggestedTimer
};


export default {
    getSuggestedTimer
}
