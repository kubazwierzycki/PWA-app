import axios from "axios";
import {BoardGameRank} from "../types/IBoardgames.ts";
import api_address from "../config/api_address.ts";
import axiosRetry from "axios-retry";


const baseUrl = api_address.backend + "/users";

const axiosInstance = axios.create();

axiosRetry(axiosInstance, {
    retries: 20,
    retryCondition: (error) => error.response?.status === 404,
    retryDelay: (retryCount) => retryCount * 1000,
});

/**
 * GET boardgames ranking
 * @param {string} userId - user's id (UUID)
 * @returns {Promise<BoardGameRank[]>} games ranking list
 */
export const getRanking = async (userId: string): Promise<BoardGameRank[]> => {
    const request = axiosInstance({
        method: "get",
        url: `${baseUrl}/${userId}/ranking`,
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request;
    return response.data.ranking;
}

/**
 * PUT update boardgames ranking
 * @param {string} userId - user's id (UUID)
 * @param {string} token - valid user's session token (UUID)
 * @param {BoardGameRank[]} ranking - list containing current ranking to be saved
 * @returns {Promise<any>} response status code
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveRanking = async (userId: string, token: string, ranking: BoardGameRank[]):Promise<any> => {
    if (token === undefined) {
        return;
    }
    const request = axios({
        method: "put",
        url: `${baseUrl}/${userId}/ranking`,
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json"
        },
        data: {
            ranking: ranking
        }
    });

    const response = await request;
    return response.status;
}

