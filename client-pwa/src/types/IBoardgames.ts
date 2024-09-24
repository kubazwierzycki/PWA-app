
export interface NameType {
    "#text": string
}

export interface BoardGameDetails {
    "@_id": string
    name: {"@_value": string}
    description: string
    shortDescription: string
    statistics: {ratings: BoardGameStats}
    image: string
    thumbnail: string
    yearpublished: {"@_value": string}
    minplayers: {"@_value": string}
    maxplayers: {"@_value": string}
    minage: {"@_value": string}
    playingtime: {"@_value": string}
    minplaytime: {"@_value": string}
    maxplaytime: {"@_value": string}
    link: BoardGameLink[]
    poll: BoardGamePoll[]
}

export interface BoardGameLink {
    "@_id": string
    "@_type": string
    "@_value": string
}

export interface BoardGamePoll {
    "@_name": string
    "@_title": string
    "@_totalvotes": string
    results: any
}

export interface BoardGameUsersDetails {
    comment: string
    stats: {rating: {"@_value": string}}
    thumbnail: string
}

export interface BoardGameStats {
    usersRated: string
    average: {"@_value": string}
    owned: string
    ranks: {rank: [{"@_value": string}]}
}

export interface BoardGameItem {
    name: NameType
    "@_objectid": string
    details: BoardGameDetails
}

export interface BoardGameStub extends BoardGameUsersDetails {
    name: NameType
    "@_objectid": string
}

export interface FiltersState {
    rated: boolean
    commented: boolean
    minRating: boolean
}

// Board game ranking info fetched from backend
export interface BoardGameRank {
    gameId: string
    rating: number
    numberOfCompares: number
}

export interface TopBoardGame {
    "@_rank": string
    name: {"@_value": string}
    thumbnail: {"@_value": string}
    yearpublished: {"@_value": string}
}
