import axios from "axios";
import api_address from "../config/api_address";
const baseUrl = api_address.bgg;


export interface BggGameFromXML{
    name: string
    id: string
}

export interface BggGameDetailsFromXML{
    description: string
    yearpublished: string
    minplayers: string
    maxplayers: string
    playingtime : string
    minplaytime: string
    maxplaytime: string
    minage: string
    thumbnail: string
    image : string
}

const emptyBggGameDetailsFromXML= (): BggGameDetailsFromXML => ({
    description: "",
    yearpublished: "",
    minplayers: "",
    maxplayers: "",
    playingtime: "",
    minplaytime: "",
    maxplaytime: "",
    minage: "",
    thumbnail: "",
    image: "",
 });


const getDescriptionFromItem = async (bggXmlItemNode: Node): Promise<string>  => {
    const xpathExpr = `./description`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getYearpublishedFromItem = async (bggXmlItemNode: Node): Promise<string>  => {
    const xpathExpr = `./yearpublished/@value`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getMinPlayersFromItem = async (bggXmlItemNode: Node): Promise<string> => {
    const xpathExpr = `./minplayers/@value`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getMaxPlayersFromItem = async (bggXmlItemNode: Node): Promise<string>  => {
    const xpathExpr = `./maxplayers/@value`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getPlayingTimeFromItem = async (bggXmlItemNode: Node): Promise<string> => {
    const xpathExpr = `./playingtime/@value`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getMinPlayTimeFromItem = async (bggXmlItemNode: Node): Promise<string> => {
    const xpathExpr = `./minplaytime/@value`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getMaxPlayTimeFromItem = async (bggXmlItemNode: Node): Promise<string> => {
    const xpathExpr = `./maxplaytime/@value`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getMinAgeFromItem = async (bggXmlItemNode: Node): Promise<string> => {
    const xpathExpr = `./minage/@value`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getThumbnailFromItem = async (bggXmlItemNode: Node): Promise<string> => {
    const xpathExpr = `./thumbnail`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

const getImageFromItem = async (bggXmlItemNode: Node): Promise<string> => {
    const xpathExpr = `./image`;
    const xpathResult = document.evaluate(
        xpathExpr,
        bggXmlItemNode,
        null,
        XPathResult.STRING_TYPE,
        null
    );

    return xpathResult.stringValue;
}

// boardgameexpansion // boardgame
const getSharedDetails = async(bggGameDetailsFromXML : BggGameDetailsFromXML, xpathItemResult: Node) =>{
    //Concurrent Execution
    [   bggGameDetailsFromXML.description,
        bggGameDetailsFromXML.yearpublished,
        bggGameDetailsFromXML.minplayers,
        bggGameDetailsFromXML.maxplayers,
        bggGameDetailsFromXML.playingtime,
        bggGameDetailsFromXML.minplaytime,
        bggGameDetailsFromXML.maxplaytime,
        bggGameDetailsFromXML.minage
    ] = await Promise.all([
        getDescriptionFromItem(xpathItemResult),
        getYearpublishedFromItem(xpathItemResult),
        getMinPlayersFromItem(xpathItemResult),
        getMaxPlayersFromItem(xpathItemResult),
        getPlayingTimeFromItem(xpathItemResult),
        getMinPlayTimeFromItem(xpathItemResult),
        getMaxPlayTimeFromItem(xpathItemResult),
        getMinAgeFromItem(xpathItemResult)
    ]);
}
// <link type="boardgameexpansion" id="176286" value="A.D.A.P.T." inbound="true"/>
// boardgameexpansion // boardgame
const getGameDetailsFromXML =  async (res: string): Promise<BggGameDetailsFromXML>=> {
    const xmlDoc = new DOMParser().parseFromString(res, "text/xml");
    const xpathItemExpr = `/items/item`;
    const bggGameDetailsFromXML : BggGameDetailsFromXML = emptyBggGameDetailsFromXML();

    const xpathItemResult = document.evaluate(
        xpathItemExpr,
        xmlDoc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if(xpathItemResult !== null) {
        const xpathTypeExpr = `./@type`;
        const xpathTypeResult = document.evaluate(
            xpathTypeExpr,
            xpathItemResult,
            null,
            XPathResult.STRING_TYPE,
            null
        ).stringValue;
        
        await getSharedDetails(bggGameDetailsFromXML, xpathItemResult);

        if(xpathTypeResult === "boardgame") {
            [bggGameDetailsFromXML.thumbnail, bggGameDetailsFromXML.image] = await Promise.all([
                getThumbnailFromItem(xpathItemResult),
                getImageFromItem(xpathItemResult)
            ]);
        } else {
            //get parent element first
            bggGameDetailsFromXML.thumbnail = "";
            bggGameDetailsFromXML.image = "";
            console.log("Not implemented");
        }
    }

    return bggGameDetailsFromXML;
}

const getGameDetails =  async (gameId : string) => {
    const request = axios({
        method: "get",
        url: `${baseUrl}/thing?id=${gameId}`,
    });
    const response = await request;
    return response.data;
}

const getAllGamesFromXML = async (res: string): Promise<BggGameFromXML[]> =>  {
    const xmlDoc = new DOMParser().parseFromString(res, "text/xml");
    const xpathNameExpr = "/items/item/name/@value";
    const xpathNameResult = document.evaluate(
        xpathNameExpr,
        xmlDoc,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );

    let node;
    const result : BggGameFromXML[]   = [];

    node = xpathNameResult.iterateNext()
    let i = 0;
    while (node) {
        result.push({"name" : node.textContent ?  node.textContent : "0" , "id" : "0"})
        node = xpathNameResult.iterateNext()
        i++;
    }

    const xpathIdExpr = "/items/item/@id";
    const xpathIdResult = document.evaluate(
        xpathIdExpr,
        xmlDoc,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );

    node = xpathIdResult.iterateNext()
    i = 0;
    while (node) {
        result[i].id = node.textContent ?  node.textContent : "0" ;
        node = xpathIdResult.iterateNext()
        i++;
    }

    return result;
}


const getAllGamesFromCollectionXML = async (res: string): Promise<BggGameFromXML[]> =>  {
    const xmlDoc = new DOMParser().parseFromString(res, "text/xml");
    const xpathNameExpr = "/items/item/name";
    const xpathNameResult = document.evaluate(
        xpathNameExpr,
        xmlDoc,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );

    let node;
    const result : BggGameFromXML[]   = [];

    
    node = xpathNameResult.iterateNext()
    let i = 0;
    while (node) {
        result.push({"name" : node.textContent ?  node.textContent : "0" , "id" : "0"})
        node = xpathNameResult.iterateNext()
        i++;
    }

    const xpathIdExpr = "/items/item/@objectid";
    const xpathIdResult = document.evaluate(
        xpathIdExpr,
        xmlDoc,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );

    node = xpathIdResult.iterateNext()
    i = 0;
    while (node) {
        result[i].id = node.textContent ?  node.textContent : "0" ;
        node = xpathIdResult.iterateNext()
        i++;
    }
    
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

const getPlayeCollectionXML = async (username : string, signal: AbortSignal) => {
    const request = axios({
        method: "get",
        signal: signal, //signal from controller
        url: `${baseUrl}/collection?username=${username}&subtype=boardgame`,
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
    getPlayeCollectionXML,
    getBggGameById,
    getGameImageSrcFromResponse,
    getBggGamesXMLByPatten,
    getAllGamesFromXML,
    getAllGamesFromCollectionXML,
    getGameDetails,
    getGameDetailsFromXML
};
