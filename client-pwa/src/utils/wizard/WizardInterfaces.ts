
export interface IWizardParams {
    numPlayers: number
    playersAge: number[]
    minPlayingTime: number
    maxPlayingTime: number
}

export interface IWizardGameInput {
    id: string
    userRating: number
    bggRating: number
}

export interface IGameSuggestion {
    id: string
    name: string
    score: number
    category: string
}

export interface IWizardOutput {
    suggestions: IGameSuggestion[]
}
