import {IWizardGameInput, IWizardOutput, IWizardParams} from "./WizardInterfaces.ts";
import {wizardWeights} from "./WizardConfig.ts";

// overlap condition
const isPlayTimeRangeOverlap = (
    paramsMin,
    paramsMax,
    gameMin,
    gameMax
) => Math.max(paramsMin, gameMin) <= Math.min(paramsMax, gameMax);



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
        game.minPlayTime,
        game.maxPlayTime
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
    // subtract points for discrepancies
    for (let item of set) {
        // average playing time fit

        // number of players fit ?????
    }
}

export default getBestGames;
