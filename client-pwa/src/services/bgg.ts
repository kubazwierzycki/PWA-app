import axios from "axios";
const baseUrl = "https://boardgamegeek.com/xmlapi2";

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



export default { getUserByUsername, getUserIdFromResponse, getBggGameById, getGameImageSrcFromResponse };
