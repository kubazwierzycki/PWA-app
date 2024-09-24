/**
 * Functions conforming data from BGG API to algorithm interfaces
 */
import {getGameDetails} from "../../services/boardgames.ts";
import {BoardGameDetails, BoardGameLink, BoardGamePoll, BoardGameRank, BoardGameStub} from "../../types/IBoardgames.ts";
import {IWizardGameInput} from "./WizardInterfaces.ts";


const parseGame = (game: BoardGameDetails, ranking: BoardGameRank[]): IWizardGameInput | null => {

    const gameId = game["@_id"];
    if (gameId === undefined) {
        return null;
    }

    // extract name
    const nameElement = game.name["@_value"];
    const name = nameElement ? nameElement : "";

    // BGG community rating
    const ratings = game.statistics.ratings;
    const bggRating = parseFloat(ratings.average["@_value"]) || 0;

    // user rating
    const userRating = ranking.find(rank => rank.gameId === gameId)?.rating || 0;

    // Categories extraction
    const categories = game.link
        .filter((link: BoardGameLink) => link["@_type"] === "boardgamecategory")
        .map((link: BoardGameLink) => link["@_value"]);

    // Player and time information
    const minPlayers = game.minplayers["@_value"] || "";
    const maxPlayers = game.maxplayers["@_value"] || "";
    const minPlayTime = game.minplaytime["@_value"] || "";
    const maxPlayTime = game.maxplaytime["@_value"] || "";
    const avgPlayTime = game.playingtime["@_value"] || "";
    const minAge = game.minage["@_value"] || "";

    // Suggested player polls
    const suggestedNumPlayersPoll = game.poll.find((poll: BoardGamePoll) =>
        poll["@_name"] === "suggested_numplayers"
    );
    const suggestedPlayerAgePoll = game.poll.find((poll: BoardGamePoll) =>
        poll["@_name"] === "suggested_playerage"
    );

    const suggestedNumPlayers = suggestedNumPlayersPoll ? parsePoll(suggestedNumPlayersPoll) : { name: '', totalVotes: 0, results: [] };
    const suggestedPlayerAge = suggestedPlayerAgePoll ? parsePoll(suggestedPlayerAgePoll) : { name: '', totalVotes: 0, results: [] };

    // Statistics
    const statistics = {
        ratings: {
            average: { "@_value": ratings.average["@_value"] || "0" },
        },
    };

    return {
        id: game["@_id"],
        name: name,
        userRating: userRating,
        bggRating: bggRating,
        categories: categories,
        minPlayers: minPlayers,
        maxPlayers: maxPlayers,
        minPlayTime: minPlayTime,
        maxPlayTime: maxPlayTime,
        avgPlayTime: avgPlayTime,
        minAge: minAge,
        suggestedNumPlayers: suggestedNumPlayers,
        suggestedPlayerAge: suggestedPlayerAge,
        statistics: statistics,
    };

}

export const getCollectionData = async (games: BoardGameStub[], ranking: BoardGameRank[]) => {
    const idsList = games.map(game => game["@_objectid"]).join(",");
    console.log(idsList);
    let details = await getGameDetails(idsList);
    console.log(details);





}


