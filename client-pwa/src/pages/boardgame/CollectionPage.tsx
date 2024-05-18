import {ReactNode, useEffect, useState} from "react";
import CollectionToggle from "../../components/CollectionToggle.tsx";
import styles from "../../styles/collections.module.css"
import BoardGameTile from "../../components/BoardGameTile.tsx";
import {Pagination} from "@mui/material";
import axios from "axios";
import {parseXml} from "../../utils/XMLToJSON.ts";
import {clearCharEntities, getShortDescription} from "../../utils/DescriptionParser.ts";

interface NameType {
    "#text": string
}

interface BoardGameDetails {
    description: string,
    shortDescription: string,
    statistics: {ratings: BoardGameStats}
}

interface BoardGameStats {
    usersRated: string,
    average: {"@_value": string},
    owned: string
}

interface BoardGameItem {
    name: NameType,
    "@_objectid": string,
    details: BoardGameDetails,
    thumbnail: string
}

/**
 * User game board collection page
 * @returns {ReactNode}
 */
const CollectionPage = (): ReactNode => {

    // FOR TESTING
    const username: string = "bhr_79";

    const [games, setGames] = useState<BoardGameItem[]>([]);

    const baseApiAddress: string = 'https://boardgamegeek.com/xmlapi2';

    useEffect(() => {
        const request  = axios({
            method: 'get',
            url: `${baseApiAddress}/collection?username=${username}`,
        })
        request.then(response => {
            let data: BoardGameItem[] = parseXml(response.data).items.item;
            for (let i=0; i<data.length; i++) {
                let game = data[i];
                // get board game details
                const request  = axios({
                    method: 'get',
                    url: `${baseApiAddress}/thing?id=${game["@_objectid"]}&stats=1`,
                })
                request.then(details => {
                    data[i]["details"] = parseXml(details.data).items.item;
                    // correct description
                    const correctedDescription = clearCharEntities(data[i]["details"].description);
                    data[i]["details"].description = correctedDescription;
                    // short description
                    data[i]["details"]["shortDescription"] = getShortDescription(correctedDescription);
                    console.log(data[i].details.statistics.ratings.average["@_value"])
                })
            }
            setGames(data)
        })
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <CollectionToggle />
            </div>
            <div className={styles.body}>
                {
                    games.map(game => (
                        <BoardGameTile data={game} key={game.name["#text"]}/>
                    ))
                }
            </div>
            <div className={styles.pagination}>
                <Pagination count={10} shape="rounded" />
            </div>
        </div>
    )
}

export default CollectionPage;
