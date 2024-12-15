import {
    IGameSuggestion,
    IWizardGameInput,
    IWizardOutput,
    IWizardParams,
    IWizardUserGameRank,
    IWizardWeights
} from "./WizardInterfaces.ts";
import {wizardWeights} from "./WizardConfig.ts";


const PI = Math.PI;
const E = Math.E;

const GAME_WEIGHT_SCALE = 5.0;

const weightedAverage = (values: number[], weights: number[]): number => {
    if (values.length !== weights.length) {
        return -1;
    }
    let result = 0;
    for (let i=0; i<values.length; i++) {
        result += values[i] * weights[i];
    }
    result /= values.length;
    return result;
}

const average = (values: number[]): number => {
    return weightedAverage(values, values.map(() => 1));
}

/**
 * Calculates standard deviation of data from its mean
 * @param {number[]} values
 */
const std = (values: number[]) => {
    const mean = average(values);
    const squaredDiffs = values.map(val => (val - mean) ** 2);
    const meanSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
    return Math.sqrt(meanSquaredDiff);
}

// overlap condition
const isPlayTimeRangeOverlap = (
    paramsMin: number,
    paramsMax: number,
    gameMin: number,
    gameMax: number
) => Math.max(paramsMin, gameMin) <= Math.min(paramsMax, gameMax);

/**
 * Higher order function returning function of standard normal distribution
 * With parameters based on given sigma (standard deviation) and mi (mean)
 * Used to create a function assigning points over the spectrum of range
 * Normalizes return value to [0-1] range
 * @param {number} sigma - standard deviation of mean
 * @param {number} mi - mean value
 * @returns - function that gives points (0-1) for value based on deviation to expected value
 */
const standardNormalDistributionPoints = (sigma: number, mi: number) => {
    const sigmaSquared = sigma ** 2;

    // normalizing factor
    const scale = Math.sqrt(2*PI*sigmaSquared);

    return (x: number) => (1/(Math.sqrt(2*PI*sigmaSquared)))*(E**(-1*(((x - mi)**2)/(2*sigmaSquared)))) * scale;
}

/**
 * Higher order function returning function of standard normal distribution
 * With parameters based on acceptable range
 * Used to create a function assigning points over the spectrum of range
 * Normalizes return value to [0-1] range
 * @param {number} min - start of range
 * @param {number} max - end of range
 * @returns - function that gives points (0-1) for value within a range
 */
const standardNormalDistributionRangePoints = (min: number, max: number) => {
    const sigma = (max - min) / 2.0;
    const mi = sigma + min;

    return standardNormalDistributionPoints(sigma, mi);
}

// handles special case age label
const parseAge = (ageLabel: string): number => {
    if (ageLabel === "21 and up") return 21;
    else return parseInt(ageLabel);
}

// handles special case number of players label
const parseNumPlayers = (numPlayersLabel: string): number => {
    if (numPlayersLabel.includes("+")) {
        const numberPart = numPlayersLabel.slice(0, numPlayersLabel.indexOf("+"));
        return parseInt(numberPart);
    }
    else return parseInt(numPlayersLabel);
}

/**
 * Public interface for wizard logic algorithm
 * @param {IWizardGameInput[]} input - list of game input objects
 * @param {IWizardParams} params - object with user parameters for the game
 * @returns {IWizardOutput} - list of 5 best games from input for given params
 */
const getBestGames = (input: IWizardGameInput[], params: IWizardParams): IWizardOutput => {
    // filter out deal breakers
    input = input.filter(game =>
        parseInt(game.minPlayers) <= params.numPlayers &&
        parseInt(game.maxPlayers) >= params.numPlayers
    );
    const minPlayerAge = Math.min(...params.playersAge);
    input = input.filter(game => minPlayerAge >= parseInt(game.minAge));
    input = input.filter(game => isPlayTimeRangeOverlap(
        params.minPlayingTime,
        params.maxPlayingTime,
        parseInt(game.minPlayTime),
        parseInt(game.maxPlayTime)
    ));
    // assume perfect initial score for each game
    let set = input.map(game => {
        return {game: game, score: 100.0}
    });
    // get weights
    const weights = new Map<number, IWizardWeights>();
    input.forEach(game => {
        let calculatedWeights = wizardWeights(
            game.suggestedPlayerAge.results.length,
            game.suggestedPlayerAge.totalVotes,
            game.suggestedNumPlayers.results.length,
            game.suggestedNumPlayers.totalVotes
        );
        weights.set(parseInt(game.id), calculatedWeights)
    });

    // function assigning points for average play time
    const avgPlayingTimePoints = standardNormalDistributionRangePoints(params.minPlayingTime, params.maxPlayingTime);

    // function assigning points for players age poll fit
    const avgPlayerAge = average(params.playersAge);
    const stdPlayersAge = std(params.playersAge);
    const playersAgePoints = standardNormalDistributionPoints(stdPlayersAge, avgPlayerAge);

    // function assigning points for number of players poll fit
    const numberOfPlayersPoints = standardNormalDistributionPoints(5, params.numPlayers);

    // subtract points for discrepancies
    for (let item of set) {

        // get weights
        const itemWeights: IWizardWeights = weights.get(parseInt(item.game.id)) ?? {
            userRating: 0,
            bggCommunityRating: 0,
            playingTimeFit: 0,
            numberPlayersFit: 0,
            playersAgePoll: 0,
            numberPlayersPoll: 0,
            gameWeight: 0,
            sum: 0
        } as IWizardWeights;

        // average playing time fit
        const avgPlayingTimeScore = avgPlayingTimePoints(parseInt(item.game.avgPlayTime)) * itemWeights.playingTimeFit;

        // players age poll
        const expectedAgePollValue = weightedAverage(
            item.game.suggestedPlayerAge.results.map(option => parseAge(option.value)),
            item.game.suggestedPlayerAge.results.map(option => option.numVotes)
        );
        const playersAgeScore = playersAgePoints(expectedAgePollValue) * itemWeights.playersAgePoll;

        // number of players poll
        const expectedNumberOfPlayersPollValue = weightedAverage(
            item.game.suggestedNumPlayers.results.map(option => parseNumPlayers(option.value)),
            item.game.suggestedNumPlayers.results.map(option => option.numVotes)
        );

        const numberOfPlayersScore = numberOfPlayersPoints(expectedNumberOfPlayersPollValue) * itemWeights.numberPlayersPoll;

        // BGG community ranking score
        const communityRanking = parseFloat(item.game.statistics.ratings.average["@_value"]);
        const communityRankingScore = communityRanking / 10.0 * itemWeights.bggCommunityRating;

        // user game ranking
        const userGameRanking = params.ranking[parseInt(item.game.id)] ?? {
            gameId: item.game.id,
            rating: 0
        } as IWizardUserGameRank;
        const userGameRankingScore = userGameRanking.rating / 10.0 * itemWeights.userRating;

        // game weight ranking
        const expectedGameWeight = params.gameWeight;
        const itemWeight = parseFloat(item.game.statistics.ratings.averageweight["@_value"]);
        const distance = Math.abs(expectedGameWeight - itemWeight);
        const gameWeightScore = Math.pow((1.0 - distance / GAME_WEIGHT_SCALE), 2) * itemWeights.gameWeight;

        // calculate final score
        const score = avgPlayingTimeScore + playersAgeScore + numberOfPlayersScore +
            communityRankingScore + userGameRankingScore + gameWeightScore;
        item.score = score * 100;
    }

    // sort games by score
    set.sort((a, b) => b.score - a.score);

    // get top 5 games
    set = set.slice(0, 5);

    // return suggestions object
    const suggestionsList = set.map(item => ({
        id: item.game.id,
        name: item.game.name,
        thumbnail: item.game.thumbnail,
        score: item.score,
        categories: item.game.categories
    } as IGameSuggestion))
    return {suggestions: suggestionsList} as IWizardOutput;
}

export default getBestGames;
