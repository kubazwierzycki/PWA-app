import axios from "axios";
import {parseXml} from "../utils/XMLToJSON.ts";
import {BoardGameDetails, BoardGameStub, TopBoardGame} from "../types/IBoardgames.ts";
import {clearCharEntities, getShortDescription} from "../utils/DescriptionParser.ts";
import api_address from "../config/api_address.ts";

const baseApiAddress: string = api_address.bgg;

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(response => {
    // 2xx response
    if (response.status === 202) {
        console.log('202')
        throw new axios.Cancel('Data not ready');
    }
    else return response;
}, (error) => {
    return Promise.reject(error);
});

const MAX_RETRY = 20;
let currentRetry = 0;

const axiosSuccessHandler = (res: any) => {
    currentRetry = 0;
    return res;
}

const axiosErrorHandler = async (url: string) => {
    if (currentRetry < MAX_RETRY) {
        currentRetry++;
        return getWithRetry(url);
    }
    else {
        console.log('Error: Failed to load data');
    }
}

const getWithRetry = async (url: string): Promise<any> => {
    return axiosInstance.get(url)
        .then((res) => axiosSuccessHandler(res))
        .catch(() => axiosErrorHandler(url));
}


/**
 * Function fetching full info about board game(s) by its id using BGG API
 * Allows for fetching multiple game details in batch
 * @param {string | undefined} gameId - identifier of the board game,
 * single id or comma separated list
 * @returns {Promise<BoardGameDetails[]>} promise for a list (even if single element present) of
 * object conforming {@link BoardGameDetails}
 */
export const getGameDetails = async (gameId: string | undefined): Promise<BoardGameDetails[]> => {

    if (gameId === undefined) return [];

    const url = `${baseApiAddress}/thing?id=${gameId}&stats=1`;

    const detailsResponse = await getWithRetry(url);
    let gameDetails = parseXml(detailsResponse.data).items.item;

    // special case when only one item present
    if (!Array.isArray(gameDetails)) {
        gameDetails = [gameDetails];
    }

    for (let item of gameDetails) {

        // take only primary name if multiple provided
        if (Array.isArray(item.name)) {
            item.name = item.name[0];
        }

        // correct descriptions
        const correctedDescription = clearCharEntities(item.description);
        item.description = correctedDescription;
        item.shortDescription = getShortDescription(correctedDescription);
    }

    return gameDetails;
}


/**
 * Function fetching list of board games in a collection
 * @param {string} bggUsername - BGG username of collection owner (current user)
 * @param {string} urlParams - request additional params as & connected string
 * @returns {@link Promise<BoardGameStub[]>}
 */
export const getGames = async (bggUsername: string, urlParams: string): Promise<BoardGameStub[]> => {

    const url = `${baseApiAddress}/collection?username=${bggUsername}&stats=1${urlParams}`;
    const collectionResponse = await getWithRetry(url);

    if (collectionResponse.status === 200) {
        const parsedData = parseXml(collectionResponse.data);

        let gamesData: BoardGameStub[] = [] as BoardGameStub[];

        // wrap in array if only one item present
        if (parsedData.items["@_totalitems"] == 1) {
            gamesData.push(parsedData.items.item);
        } else {
            gamesData = parsedData.items.item;
        }

        return gamesData;
    }
    return [] as BoardGameStub[];
}

/**
 * Function fetching currently "hottest" BGG games list
 * Used for game of the day homepage view
 * @returns {Promise<TopBoardGame[]>}
 */
export const getTopGames = async (): Promise<TopBoardGame[]> => {

    const url = `${baseApiAddress}/hot/type=boardgame`;

    const response = await getWithRetry(url);
    return parseXml(response.data).items.item;
}

