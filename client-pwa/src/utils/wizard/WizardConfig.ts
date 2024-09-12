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
    userRating: 0.2,
    bggCommunityRating: 0.2,
    playingTimeFit: 0.15,
    numberPlayersFit: 0.15,
    playingTimePoll: 0.15,
    numberPlayersPoll: 0.15
}

const EXPECTED_VOTES_PER_OPTION: number = 5;

/**
 * Function creating weights set for wizard algorithm
 * Takes into consideration credibility of BGG polls, based on number of votes compared to number of options in a poll
 * @param {number} playingTimeOptionsCount
 * @param {number} playingTimeVotes
 * @param {number} numberPlayersOptionsCount
 * @param {number} numberPlayersVotes
 * @returns {@link IWizardWeights} object with
 */
export const wizardWeights = (
    playingTimeOptionsCount: number,
    playingTimeVotes: number,
    numberPlayersOptionsCount: number,
    numberPlayersVotes: number
): IWizardWeights => {

    const playingTimeFitCredibility = playingTimeVotes / (playingTimeOptionsCount * EXPECTED_VOTES_PER_OPTION);
    const numberPlayersFitCredibility = numberPlayersVotes / (numberPlayersOptionsCount * EXPECTED_VOTES_PER_OPTION);

    return {
        userRating: weights.userRating,
        bggCommunityRating: weights.bggCommunityRating,
        playingTimeFit: weights.playingTimeFit,
        numberPlayersFit: weights.numberPlayersFit,
        playingTimePoll: weights.playingTimePoll * playingTimeFitCredibility,
        numberPlayersPoll: weights.numberPlayersPoll * numberPlayersFitCredibility
    }
}
