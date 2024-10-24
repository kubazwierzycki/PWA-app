import axios from "axios";
import api_address from "../config/api_address.ts";

const baseUrl = `${api_address.backend}/experience`;

export interface GameStatistic {
    numberOfPlays: number
    numberOfWins: number
    firstPlay: string
    lastPlay: string
    avgRating: number
}

/**
 * Get statistic for specific game and user
 */
const getStatistic = async (userId: string, gameId: string) : Promise<GameStatistic> => {
    const request = axios({
        method: "get",
        url: `${baseUrl}/${userId}/${gameId}`,
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request;
    const data = response.data;

    const gameStatistic : GameStatistic = {
        numberOfPlays: data.numberOfPlays,
        numberOfWins: data.numberOfWins,
        firstPlay: data.firstPlay,
        lastPlay: data.lastPlay,
        avgRating: data.avgRating
    }

    return gameStatistic;
};

export default{
    getStatistic
}
