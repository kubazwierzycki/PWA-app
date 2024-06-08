import axios from "axios";
import {parseXml} from "../utils/XMLToJSON.ts";

const baseApiAddress: string = 'https://boardgamegeek.com/xmlapi2';

interface BoardGameStats {
    usersRated: string,
    average: {"@_value": string},
    owned: string,
    ranks: {rank: [{"@_value": string}]}
}

interface BoardGameDetails {
    description: string,
    shortDescription: string,
    statistics: {ratings: BoardGameStats},
    thumbnail: string,
    yearpublished: {"@_value": string},
    minplayers: {"@_value": string},
    maxplayers: {"@_value": string},
    minage: {"@_value": string},
    playingtime: {"@_value": string}
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

    const detailsResponse = await axios.get(url);
    let gameDetails = parseXml(detailsResponse.data).items.item;

    // special case when only one item present
    if (!Array.isArray(gameDetails)) {
        gameDetails = [gameDetails];
    }

    return gameDetails;
}

