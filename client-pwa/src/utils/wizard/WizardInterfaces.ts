
export interface IWizardUserGameRank {
    gameId: string
    rating: number
}

export interface IWizardParams {
    numPlayers: number
    playersAge: number[]
    minPlayingTime: number
    maxPlayingTime: number
    ranking: IWizardUserGameRank[]
    gameWeight: number
}

export interface IWizardGameInputStats {
    average: {"@_value": string}
    averageweight: {"@_value": string}
}

export interface IWizardGameInput {
    id: string
    name: string
    thumbnail: string
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
    statistics: {ratings: IWizardGameInputStats}
    averageWeight: number
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
    playersAgePoll: number
    numberPlayersPoll: number
    gameWeight: number
    sum: number
}

export interface IGameSuggestion {
    id: string
    name: string
    thumbnail: string
    score: number
    categories: string[]
}

export interface IWizardOutput {
    suggestions: IGameSuggestion[]
}
