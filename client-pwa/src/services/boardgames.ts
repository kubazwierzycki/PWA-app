import axios from "axios";
import {parseXml} from "../utils/XMLToJSON.ts";
import {BoardGameDetails, BoardGameStub, TopBoardGame} from "../types/IBoardgames.ts";
import {clearCharEntities, getShortDescription} from "../utils/DescriptionParser.ts";
import axiosRetry from "axios-retry";
import api_address from "../config/api_address.ts";

const baseApiAddress: string = api_address.bgg;


// Configure axios to retry up to 3 times with a 2-second delay between retries
axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount: number) => retryCount * 1000, // 1 second delay
    retryCondition: (error) => error.response?.status === 202, // retry only for 202 status
});


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

    const detailsResponse = await axios.get(url);
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
    const collectionResponse = await axios.get(url);

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

    const response = await axios.get(url);
    return parseXml(response.data).items.item;
}

