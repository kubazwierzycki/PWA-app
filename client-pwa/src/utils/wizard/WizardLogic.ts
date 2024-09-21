import {IWizardGameInput, IWizardOutput, IWizardParams} from "./WizardInterfaces.ts";
import {wizardWeights} from "./WizardConfig.ts";


const PI = Math.PI;
const E = Math.E;


// overlap condition
const isPlayTimeRangeOverlap = (
    paramsMin: number,
    paramsMax: number,
    gameMin: number,
    gameMax: number
) => Math.max(paramsMin, gameMin) <= Math.min(paramsMax, gameMax);

/**
 * Higher order function returning function of standard normal distribution
 * With parameters based on acceptable range
 * Used to create a function assigning points over the spectrum of range
 * @param {number} min - start of range
 * @param {number} max - end of range
 * @returns - function that gives points for value within a range
 */
const standardNormalDistributionPoints = (min: number, max: number) => {
    const sigma = (max - min) / 2.0;
    const mi = sigma + min;

    const sigmaSquared = sigma ** 2;

    // normalizing factor
    const scale = Math.sqrt(2*PI*sigmaSquared);

    return (x: number) => (1/(Math.sqrt(2*PI*sigmaSquared)))*(E**(-1*(((x - mi)**2)/(2*sigmaSquared)))) * scale;
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
    const avgPlayingTimePoints = standardNormalDistributionPoints(params.minPlayingTime, params.maxPlayingTime);
    // subtract points for discrepancies
    for (let item of set) {
        // average playing time fit
        const avgPlayingTimeScore = avgPlayingTimePoints(parseInt(item.game.avgPlayTime));
        // number of players fit ?????

        // players age poll

        // number of players poll

        const score = avgPlayingTimeScore;
        item.score = score;
    }
}

export default getBestGames;
