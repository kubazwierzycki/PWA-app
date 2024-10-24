import axios from "axios";
import api_address from "../config/api_address";
const baseUrl = api_address.bgg;

export interface BggGameFromXML{
    name: string
    gameId: string
}

const getAllGamesFromXML = async (res: string): Promise<BggGameFromXML[]> =>  {
    console.log(res);
    const xmlDoc = new DOMParser().parseFromString(res, "text/xml");
    const xpathExpr = "/items/item/name/@value";
    const xpathResult = document.evaluate(
        xpathExpr,
        xmlDoc,
        null,
        XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
        null
    );
    console.log(xpathResult);

    let node;
    const result : BggGameFromXML[]   = [];
    // eslint-disable-next-line no-cond-assign
    while (node = xpathResult.iterateNext()) {
        result.push({"name":node.textContent ? node.textContent :"None", "gameId":"0"})
    }
    console.log(result);
    
    return result;
}

const getBggGamesXMLByPatten = async (pattern : string, signal: AbortSignal) => {
    const request = axios({
        method: "get",
        signal: signal, //signal from controller
        url: `${baseUrl}/search?query=${pattern}&type=boardgame`,
    });

    const response = await request;
    return response.data;
}



const getUserByUsername = (bggUsername: string) => {
    const request = axios({
        method: "get",
        url: `${baseUrl}/user?name=${bggUsername}`,
    });

    return request.then((response) => response.data);
};

const getUserIdFromResponse = (res: string): string => {
    //Extract user id from BGG XML response for request to /user endpoint.
    const xmlDoc = new DOMParser().parseFromString(res, "text/xml");
    const xpathExpr = "/user/@id";
    const xpathResult = document.evaluate(
        xpathExpr,
        xmlDoc,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
};

const getBggGameById = (bggGameId : number) => {
    const request = axios({
        method: "get",
        url: `${baseUrl}/thing?id=${bggGameId}`,
    });

    return request.then((response) => response.data);
};


const getGameImageSrcFromResponse = (res: string) : string =>{
    //Extract user id from BGG XML response for request to /user endpoint.
    const xmlDoc = new DOMParser().parseFromString(res, "text/xml");
    const xpathExpr = "/items[1]/item[1]/image";
    const xpathResult = document.evaluate(
        xpathExpr,
        xmlDoc,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}



export default {
    getUserByUsername,
    getUserIdFromResponse,
    getBggGameById,
    getGameImageSrcFromResponse,
    getBggGamesXMLByPatten,
    getAllGamesFromXML
};
