import {IWizardGameInput, IWizardOutput, IWizardParams} from "./WizardInterfaces.ts";
import {wizardWeights} from "./WizardConfig.ts";


const PI = Math.PI;
const E = Math.E;

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
 * @param {number} sigma - standard deviation of mean
 * @param {number} mi - mean value
 * @returns - function that gives points for value based on deviation to expected value
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
 * @param {number} min - start of range
 * @param {number} max - end of range
 * @returns - function that gives points for value within a range
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
    const weights = input.map(game => {
        return {
            game: game.id,
            weights: wizardWeights(
                game.suggestedPlayerAge.results.length,
                game.suggestedPlayerAge.totalVotes,
                game.suggestedNumPlayers.results.length,
                game.suggestedNumPlayers.totalVotes
            )
        }
    });

    // function assigning points for average play time
    const avgPlayingTimePoints = standardNormalDistributionRangePoints(params.minPlayingTime, params.maxPlayingTime);

    // function assigning points for players age fit
    const avgPlayerAge = average(params.playersAge);
    const stdPlayersAge = std(params.playersAge);
    const playersAgePoints = standardNormalDistributionPoints(stdPlayersAge, avgPlayerAge);

    // subtract points for discrepancies
    for (let item of set) {
        // average playing time fit
        const avgPlayingTimeScore = avgPlayingTimePoints(parseInt(item.game.avgPlayTime));
        // number of players fit ?????

        // players age poll
        const expectedAgePollValue = weightedAverage(
            item.game.suggestedPlayerAge.results.map(option => parseAge(option.value)),
            item.game.suggestedPlayerAge.results.map(option => option.numVotes)
        );
        const playersAgeScore = playersAgePoints(expectedAgePollValue);
        // number of players poll

        const score = avgPlayingTimeScore + playersAgeScore;
        item.score = score;
    }
}

export default getBestGames;
