/**
 * Functions conforming data from BGG API to algorithm interfaces
 */
import {getGameDetails} from "../../services/boardgames.ts";
import {BoardGameDetails, BoardGameLink, BoardGamePoll, BoardGameRank, BoardGameStub} from "../../types/IBoardgames.ts";
import {IAbstractPoll, IWizardGameInput} from "./WizardInterfaces.ts";


// Function to parse a simple poll into IAbstractPoll format
function parseSimplePoll(pollData: BoardGamePoll): IAbstractPoll {

    const results = pollData.results.result.map((result: any) => ({
        value: result["@_value"] as string,
        numVotes: parseInt(result["@_numvotes"]),
    }));

    return {
        name: pollData["@_title"],
        totalVotes: parseInt(pollData["@_totalvotes"]),
        results,
    };
}

// Function to parse a descriptive poll ("suggested_numplayers") into IAbstractPoll format
function parseDescriptivePoll(pollData: BoardGamePoll): IAbstractPoll {

    // ignore rare weird BGG data cases
    if (!Array.isArray(pollData.results)) {
        return {
            name: pollData["@_title"],
            totalVotes: parseInt(pollData["@_totalvotes"]),
            results: [],
        };
    }
    const results = pollData.results.map((result: any) => {

        const resultArray: any[] = result.result;

        // parsing descriptive values as follows:
        // Best - 1.0
        // Recommended - 0.66
        // Not Recommended - 0
        const parseValue = (val: string): number => {
            switch (val) {
                case 'Best':
                    return 1.0;
                case 'Recommended':
                    return 0.66;
                case 'Not Recommended':
                    return 0;
                default:
                    return 0;
            }
        };

        let valueResult = 0.0;
        resultArray.forEach(res => {
            valueResult += parseValue(res["@_value"]) * parseInt(res["@_numvotes"]);
        })
        if (parseInt(result["@_numplayers"]) === 0) {
            valueResult = 0;
        }
        else {
            valueResult /= parseInt(result["@_numplayers"]);
        }

        return {
            value: valueResult.toString(),
            numVotes: parseInt(result["@_numplayers"]),
        }
    });

    return {
        name: pollData["@_title"],
        totalVotes: parseInt(pollData["@_totalvotes"]),
        results,
    };
}

const parseGame = (game: BoardGameDetails, ranking: BoardGameRank[]): IWizardGameInput => {

    const gameId = game["@_id"];
    if (gameId === undefined) {
        return {} as IWizardGameInput;
    }

    // extract name
    const nameElement = game.name["@_value"];
    const name = nameElement ? nameElement : "";

    // BGG community rating
    const ratings = game.statistics.ratings;
    const bggRating = parseFloat(ratings.average["@_value"]) || 0;

    // user rating
    const userRating = ranking.find(rank => rank.gameId === gameId)?.rating || 0;

    // extract categories
    const categories = game.link
        .filter((link: BoardGameLink) => link["@_type"] === "boardgamecategory")
        .map((link: BoardGameLink) => link["@_value"]);

    // player and game time information
    const minPlayers = game.minplayers["@_value"] || "";
    const maxPlayers = game.maxplayers["@_value"] || "";
    const minPlayTime = game.minplaytime["@_value"] || "";
    const maxPlayTime = game.maxplaytime["@_value"] || "";
    const avgPlayTime = game.playingtime["@_value"] || "";
    const minAge = game.minage["@_value"] || "";

    // suggestion polls
    const suggestedNumPlayersPoll = game.poll.find((poll: BoardGamePoll) =>
        poll["@_name"] === "suggested_numplayers"
    );
    const suggestedPlayerAgePoll = game.poll.find((poll: BoardGamePoll) =>
        poll["@_name"] === "suggested_playerage"
    );

    const suggestedNumPlayers = suggestedNumPlayersPoll ? parseDescriptivePoll(suggestedNumPlayersPoll) : { name: '', totalVotes: 0, results: [] };
    const suggestedPlayerAge = suggestedPlayerAgePoll ? parseSimplePoll(suggestedPlayerAgePoll) : { name: '', totalVotes: 0, results: [] };

    // statistics
    const statistics = {
        ratings: {
            average: { "@_value": ratings.average["@_value"] || "0" },
        },
    };

    return {
        id: game["@_id"],
        name: name,
        thumbnail: game.thumbnail,
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
    //const idsList = games.map(game => game["@_objectid"]).join(",");
    //console.log(idsList);
    let details = [] as BoardGameDetails[];
    const len = games.length;
    // BGG API allows only 20 items in one details fetch
    const maxItemsPerFetch: number = 20;
    // number of fetches necessary
    const neededFetches = Math.ceil(len / maxItemsPerFetch);
    for (let i=0; i<neededFetches; i++) {
        let gamesList = games.slice(i * maxItemsPerFetch, (i + 1) * maxItemsPerFetch);
        let idsList = gamesList.map(game => game["@_objectid"]).join(",");
        let detailsFetch = await getGameDetails(idsList);
        console.log(detailsFetch)
        details.push(...detailsFetch);
    }
    console.log(details);

    const data = details.map(game => parseGame(game, ranking));

    console.log(data);
    return data;
}


