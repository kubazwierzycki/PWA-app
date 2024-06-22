import axios from "axios";
import {BoardGameRank} from "../types/IBoardgames.ts";


const baseUrl = "http://localhost:8080/api/users";

export const getRanking = async (userId: string): Promise<BoardGameRank[]> => {
    const request = axios({
        method: "get",
        url: `${baseUrl}/${userId}/ranking`,
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request;
    return response.data;
}

