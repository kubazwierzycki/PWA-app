import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import CollectionToggle from "../../components/CollectionToggle.tsx";
import styles from "../../styles/collections.module.css"
import BoardGameTile from "../../components/BoardGameTile.tsx";
import {Pagination} from "@mui/material";
import axios from "axios";
import {parseXml} from "../../utils/XMLToJSON.ts";
import {clearCharEntities, getShortDescription} from "../../utils/DescriptionParser.ts";
import axiosRetry from "axios-retry";

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
    // bhr_79
    // Aldie
    const username: string = "bhr_79";

    const [games, setGames] = useState<BoardGameItem[]>([]);

    const baseApiAddress: string = 'https://boardgamegeek.com/xmlapi2';

    // pagination
    const [paginationLen, setPaginationLen] = useState(1);
    const [page, setPage] = useState(1);
    const perPage: number = 10; // number of board games displayed per page

    // Configure axios to retry up to 3 times with a 2-second delay between retries
    axiosRetry(axios, {
        retries: 5,
        retryDelay: (retryCount: number) => retryCount * 1000, // 1 second delay
        retryCondition: (error) => error.response?.status === 202, // retry only for 202 status
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionResponse = await axios.get(`${baseApiAddress}/collection?username=${username}`);

                if (collectionResponse.status === 200) {
                    const parsedData = parseXml(collectionResponse.data);
                    const gamesData = parsedData.items.item;

                    // check number of items
                    const totalItems = parsedData.items["@_totalitems"];
                    // calculate number of pagination pages required
                    setPaginationLen(Math.ceil(totalItems / perPage));

                    for (let i = 0; i < gamesData.length; i++) {
                        const game = gamesData[i];
                        const detailsResponse = await axios.get(`${baseApiAddress}/thing?id=${game["@_objectid"]}&stats=1`);
                        const gameDetails = parseXml(detailsResponse.data).items.item;

                        // Correct description and create short description
                        const correctedDescription = clearCharEntities(gameDetails.description);
                        gameDetails.description = correctedDescription;
                        gameDetails.shortDescription = getShortDescription(correctedDescription);

                        gamesData[i].details = gameDetails;
                    }

                    setGames(gamesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().then();
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
                <Pagination
                    count={paginationLen}
                    page={page}
                    shape="rounded"
                    onChange={(_event: ChangeEvent<unknown>, page: number) => {
                        setPage(page);
                    }}
                />
            </div>
        </div>
    )
}

export default CollectionPage;
