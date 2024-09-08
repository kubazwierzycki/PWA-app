import {IWizardGameInput, IWizardOutput, IWizardParams} from "./WizardInterfaces.ts";


/**
 * Public interface for wizard logic algorithm
 * @param {IWizardGameInput[]} input - list of game input objects
 * @param {IWizardParams} params - object with user parameters for the game
 * @returns {IWizardOutput} - list of 5 best games from input for given params
 */
const getBestGames = (input: IWizardGameInput[], params: IWizardParams): IWizardOutput => {
    // filter out deal breakers

    // assume perfect initial score

    // subtract points for discrepancies
}

export default getBestGames;
