import {IWizardGameInput, IWizardOutput, IWizardParams} from "./WizardInterfaces.ts";


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
    let minPlayerAge = Math.min(...params.playersAge);
    input = input.filter(game => minPlayerAge >= parseInt(game.minAge))
    // assume perfect initial score for each game
    let set = input.map(game => {
        return {game: game, score: 100.0}
    });
    // get weights

    // subtract points for discrepancies
}

export default getBestGames;
