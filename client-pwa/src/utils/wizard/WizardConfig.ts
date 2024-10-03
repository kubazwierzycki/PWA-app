import {IWizardWeights} from "./WizardInterfaces.ts";

/**
 * Weights system:
 * user rating - 0.2
 * bgg community rating - 0.2
 * playing time fit - 0.15
 * number of players fit - 0.15
 * playing time poll - 0.15 max
 * number of players poll - 0.15 max
 * Total: (0.7 -) 1.0
 */
const weights: IWizardWeights = {
    userRating: 0.25,
    bggCommunityRating: 0.25,
    playingTimeFit: 0.2,
    playersAgePoll: 0.15,
    numberPlayersPoll: 0.15,
    sum: 0
}

const EXPECTED_VOTES_PER_OPTION: number = 5;

/**
 * Function creating weights set for wizard algorithm
 * Takes into consideration credibility of BGG polls, based on number of votes compared to number of options in a poll
 * @param {number} playersAgeOptionsCount
 * @param {number} playersAgeVotes
 * @param {number} numberPlayersOptionsCount
 * @param {number} numberPlayersVotes
 * @returns {@link IWizardWeights} object with
 */
export const wizardWeights = (
    playersAgeOptionsCount: number,
    playersAgeVotes: number,
    numberPlayersOptionsCount: number,
    numberPlayersVotes: number
): IWizardWeights => {

    const playersAgeFitCredibility = playersAgeVotes / (playersAgeOptionsCount * EXPECTED_VOTES_PER_OPTION);
    const numberPlayersFitCredibility = numberPlayersVotes / (numberPlayersOptionsCount * EXPECTED_VOTES_PER_OPTION);

    let sum = weights.userRating + weights.bggCommunityRating + weights.playingTimeFit +
        weights.playersAgePoll * playersAgeFitCredibility + weights.numberPlayersPoll * numberPlayersFitCredibility;

    return {
        userRating: weights.userRating,
        bggCommunityRating: weights.bggCommunityRating,
        playingTimeFit: weights.playingTimeFit,
        playersAgePoll: weights.playersAgePoll * playersAgeFitCredibility,
        numberPlayersPoll: weights.numberPlayersPoll * numberPlayersFitCredibility,
        sum: sum
    }
}
