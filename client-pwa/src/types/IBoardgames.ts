import {Dispatch, SetStateAction} from "react";

export interface NameType {
    "#text": string
}

export interface BoardGameDetails {
    name: {"@_value": string}[]
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
    comment: {"#text": string}
}

export interface BoardGameStats {
    "@_value": string
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

export interface BoardGameStub {
    name: NameType
    "@_objectid": string
}

export interface FiltersState {
    rated: boolean
    commented: boolean
    minRating: boolean
}

export interface BoardgamesContextType {
    games: BoardGameStub[]
    setGames: Dispatch<SetStateAction<BoardGameStub[]>>
}

