import axios from "axios";
import api_address from "../config/api_address.ts";


export interface PutPlayroom {
    gameId: string
    game: string
    isGlobalTimer: boolean
    timer: number
}


const baseApiAddress: string = api_address.backend + '/playrooms';

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
 * @param {string} id - player's uuid
 * @param {string} username - player's username
 * @returns {Promise<boolean>} websocket message
 */
export const buildJoinWaitingRoomMessage = (playroomId: string, id: string, username: string) : object => {
    return {
        operation: "joinWaitingRoom",
        playroomId: playroomId,
        player: {
            id: id,
            username: username,
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
export const buildConfirmEndGameMessage = (playroomId: string, operationId: string ) : object => {
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

export interface PlayroomMessage {
    type: string
}

// {
//     "isClosed": false,
//     "players": [
//         {
//             "userId": "1116a8c1-113a-115f-119f-111af1ef19e3",
//             "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
//             "username": "exampleUsrname"
//         }
//     ],
//     "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd",
//     "hostID": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
//     "type": "waitingRoom"
//  }

export interface Player{
    userId : string
    playerId : string
    username : string
}

export interface waitingRoomMessage extends PlayroomMessage {
    isClosed : boolean
    players : Player[]
    playroomId : string
    hostID : string
}
