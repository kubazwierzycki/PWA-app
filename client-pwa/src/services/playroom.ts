import apiAddress from "../config/api_address.json"
import axios from "axios";


export interface PutPlayroom {
    gameId: string
    game: string
    isGlobalTimer: boolean
    timer: number
}


const baseApiAddress: string = apiAddress.backend + '/playrooms';

/**
 * POST creating empty playroom
 * @returns {Promise<string>} uuid of created playroom if successful
 */
export const createPlayroom = async (): Promise<string> => {
    const request = axios({
        method: "post",
        url: baseApiAddress,
        headers: {
            "Content-Type": "application/json",
        }
    });

    const response = await request;
    if (response.status == 200) {
        return response.data.uuid;
    }
    return "";
}

/**
 * PUT update playroom entity after playroom is ready
 * @param {string} id - uuid of the playroom assigned by server
 * @param {@link PutPlayroom} body - request body with playroom details
 * @returns {Promise<boolean>} feedback if request was successful
 */
export const updatePlayroom = async (id: string, body: PutPlayroom):Promise<boolean> => {
    const request = axios({
        method: "put",
        url: baseApiAddress + '/' + id,
        headers: {
            "Content-Type": "application/json",
        },
        data: body
    });

    const response = await request;
    console.log(response.status)
    return response.status === 201;
}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @param {string} username - player's username
 * @param {string} id - player's uuid
 * @returns {Promise<boolean>} websocket message
 */
export const buildJoinWaitingRoomMessage = (playroomId: string, username: string, id?: string) : object => {    
    if(id !== ""){
        return {
            operation: "joinWaitingRoom",
            playroomId: playroomId,
            player: {
                id: id,
                username: username,
            }
        }
    } else{
        return {
            operation: "joinWaitingRoom",
            playroomId: playroomId,
            player: {
                id: null,
                username: username,
            }
        }
    }
    

}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildCloseWaitingRoomMessage = (playroomId: string) : object => {
    return {
        "operation": "closeWaitingRoom",
        "playroomId": playroomId,
    }
}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildFinishWaitingRoomMessage = (playroomId: string) : object => {
    return {
        "operation": "finishWaitingRoom",
        "playroomId": playroomId,
    }
}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildStartGameMessage = (playroomId: string) : object => {
    return {
        "operation": "start",
        "playroomId": playroomId,
    }
}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildEndTurnMessage = (playroomId: string) : object => {
    return {
        "operation": "endTurn",
        "playroomId": playroomId,
    }
}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildCheckStatusMessage = (playroomId: string) : object => {
    return {
        "operation": "status",
        "playroomId": playroomId,
    }
}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildEndGameMessage = (playroomId: string) : object => {
    return {
        "operation": "endGame",
        "playroomId": playroomId,
    }
}

/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @param {string} operationId - id of the request assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildConfirmOperation = (playroomId: string, operationId: string ) : object => {
    return {
        "operation": "confirm",
        "playroomId": playroomId,
        "operationId": operationId,
    }
}


/**
 * @param {string} playroomId - uuid of the playroom assigned by server
 * @returns {Promise<boolean>} websocket message
 */
export const buildPauseGameMessage = (playroomId: string) : object => {
    return {
        "operation": "pause",
        "playroomId": playroomId,
    }
}

export interface SimpleMessage {
    type: string
}

export interface WaitingPlayer{
    userId : string
    playerId : string
    username : string
}

export interface PlayroomPlayer{
    timer: number
    name: string
    queueNumber: number
    playerId: string
    skipped: boolean
}

export interface Game{
    gameID : number
    name : string
}

export interface WaitingRoomMessage extends SimpleMessage {
    isClosed : boolean
    players : WaitingPlayer[]
    playroomId : string
    hostID : string
}

export interface ConfirmOperationMessage extends SimpleMessage {
    operationId : string
    question : string
    type : string
}

export interface PlayroomMessage extends SimpleMessage {
    timer : number
    paused : boolean
    game : Game
    currentPlayer : number
    players : PlayroomPlayer[]
    ended : boolean
    hostId : string
}

export interface ConfirmOperationAlert {
    operationId : string
    question : string
}
