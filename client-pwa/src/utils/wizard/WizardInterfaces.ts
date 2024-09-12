
export interface IWizardParams {
    numPlayers: number
    playersAge: number[]
    minPlayingTime: number
    maxPlayingTime: number
}

export interface IWizardGameInput {
    id: string
    name: string
    userRating: number
    bggRating: number
    categories: string[]
    minPlayers: string
    maxPlayers: string
    minPlayTime: string
    maxPlayTime: string
    avgPlayTime: string
    minAge: string
    suggestedNumPlayers: IAbstractPoll
    suggestedPlayerAge: IAbstractPoll
}

export interface IAbstractPoll {
    name: string
    totalVotes: number
    results: IAbstractPollResult[]
}

export interface IAbstractPollResult {
    value: string
    numVotes: number
}

export interface IWizardWeights {
    userRating: number
    bggCommunityRating: number
    playingTimeFit: number
    numberPlayersFit: number
    playingTimePoll: number
    numberPlayersPoll: number
}

export interface IGameSuggestion {
    id: string
    name: string
    score: number
    categories: string[]
}

export interface IWizardOutput {
    suggestions: IGameSuggestion[]
}
