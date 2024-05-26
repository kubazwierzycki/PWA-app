import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import CollectionToggle from "../../components/CollectionToggle.tsx";
import styles from "../../styles/collections.module.css"
import BoardGameTile from "../../components/BoardGameTile.tsx";
import {Pagination} from "@mui/material";
import axios from "axios";
import {parseXml} from "../../utils/XMLToJSON.ts";
import {clearCharEntities, getShortDescription} from "../../utils/DescriptionParser.ts";
import axiosRetry from "axios-retry";
import {useCollectionViewContext} from "../../contexts/CollectionViewContext.tsx";

interface NameType {
    "#text": string
}

interface BoardGameDetails {
    description: string,
    shortDescription: string,
    statistics: {ratings: BoardGameStats},
    thumbnail: string,
    yearpublished: {"@_value": string},
    minplayers: {"@_value": string},
    maxplayers: {"@_value": string},
    minage: {"@_value": string},
    playingtime: {"@_value": string}
}

interface BoardGameStats {
    usersRated: string,
    average: {"@_value": string},
    owned: string,
    ranks: {rank: [{"@_value": string}]}
}

interface BoardGameItem {
    name: NameType,
    "@_objectid": string,
    details: BoardGameDetails,
}

interface BoardGameStub {
    name: NameType,
    "@_objectid": string
}

/**
 * User game board collection page
 * @returns {ReactNode}
 */
const CollectionPage = (): ReactNode => {

    // FOR TESTING
    // bhr_79
    // Aldie
    // Sagrilarus
    const username: string = "Sagrilarus";

    const baseApiAddress: string = 'https://boardgamegeek.com/xmlapi2';

    const [games, setGames] = useState<BoardGameStub[]>([]);
    const [shownGames, setShownGames] = useState<BoardGameItem[]>([]);
    const [numGames, setNumberGames] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage: number = 10; // number of board games displayed per page

    const getPaginationLen = () => Math.ceil(numGames / perPage);

    // view toggle state from context
    const {type} = useCollectionViewContext();

    const fetchDetails = async () => {

        if (games.length === 0) return;

        // get list of required games
        const ids: string[] = [];
        let start = (currentPage - 1) * perPage;
        // add ids to list
        for (let i = start; i < start + perPage && i < games.length; i++) {
            ids.push(games[i]["@_objectid"]);
        }

        const idsList = ids.join(",");
        const url = `${baseApiAddress}/thing?id=${idsList}&stats=1`;
        const detailsResponse = await axios.get(url);
        const gameDetails = parseXml(detailsResponse.data).items.item;

        for (let i = 0; i < gameDetails.length; i++) {

            let details = gameDetails[i];

            // Correct description and create short description
            const correctedDescription = clearCharEntities(details.description);
            details.description = correctedDescription;
            details.shortDescription = getShortDescription(correctedDescription);

            gameDetails[i] = details;
        }

        let counter = -1;
        const chosenGames: BoardGameItem[] = games.slice(start, start + perPage).map(stub => {
            counter++;
            return {
                name: stub.name,
                "@_objectid": stub["@_objectid"],
                details: gameDetails[counter]
            };
        });

        setShownGames(chosenGames);
    }

    const fetchGames = async () => {
        try {

            let urlParams: string = "&";
            let parameters: string[] = [];
            if (type === "owned") {
                parameters.push("own=1");
            }
            else { // "played"
                parameters.push("played=1");
            }
            // TODO: other params from filters
            urlParams += parameters.join("&");

            let url = `${baseApiAddress}/collection?username=${username}${urlParams}`;
            const collectionResponse = await axios.get(url);

            if (collectionResponse.status === 200) {
                const parsedData = parseXml(collectionResponse.data);
                const gamesData = parsedData.items.item;

                // check number of items
                const totalItems = parsedData.items["@_totalitems"];
                setNumberGames(totalItems);

                // TODO: sort games here

                setGames(gamesData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Configure axios to retry up to 3 times with a 2-second delay between retries
    axiosRetry(axios, {
        retries: 5,
        retryDelay: (retryCount: number) => retryCount * 1000, // 1 second delay
        retryCondition: (error) => error.response?.status === 202, // retry only for 202 status
    });

    // update games list effect
    useEffect(() => {
        fetchGames().then();
    }, [type]);

    // update shownGames effect
    useEffect(() => {
        fetchDetails().then();
    }, [games, currentPage]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <CollectionToggle />
            </div>
            <div className={styles.body}>
                {
                    shownGames.map(game => (
                        <BoardGameTile data={game} key={game.name["#text"]}/>
                    ))
                }
            </div>
            <div className={styles.pagination}>
                <Pagination
                    count={getPaginationLen()}
                    page={currentPage}
                    shape="rounded"
                    onChange={(_event: ChangeEvent<unknown>, page: number) => {
                        setCurrentPage(page);
                    }}
                />
            </div>
        </div>
    )
}

export default CollectionPage;
