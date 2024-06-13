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
import {useBoardgamesContext} from "../../contexts/BoardgamesContext.tsx";
import {getGameDetails} from "../../services/boardgames.ts";
import {BoardGameItem, BoardGameStub, FiltersState} from "../../types/IBoardgames.ts";
import LoadingProgress from "../../components/LoadingProgress.tsx";


/**
 * User game board collection page
 * Uses {@link CollectionViewContext} that controls view state
 * Supports pagination and view control with {@link CollectionToggle}
 * @returns {ReactNode}
 */
const CollectionPage = (): ReactNode => {

    // FOR TESTING
    // bhr_79
    // Aldie
    // goluch
    // To be replaced with BGG username logic
    const username: string = "bhr_79";

    const baseApiAddress: string = 'https://boardgamegeek.com/xmlapi2';

    const {games, setGames} = useBoardgamesContext();

    //const [games, setGames] = useState<BoardGameStub[]>([]);
    const [shownGames, setShownGames] = useState<BoardGameItem[]>([]);
    const [numGames, setNumberGames] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage: number = 10; // number of board games displayed per page

    const getPaginationLen = () => Math.ceil(numGames / perPage);

    // view toggle state from context
    const {
        type,
        ordering,
        filtersState,
        minRating
    } = useCollectionViewContext();

    // state should be true when data not ready yet
    const [loading, setLoading] = useState<boolean>(true);

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
        const gameDetails = await getGameDetails(idsList);

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
            // popover filters
            for (const filter in filtersState) {
                if (filtersState.hasOwnProperty(filter)) {
                    if (filtersState[filter as keyof FiltersState]) {
                        switch (filter) {
                            case "rated":
                                parameters.push(`${filter}=1`);
                                break;
                            case "commented":
                                parameters.push("comment=1");
                                break;
                            case "minRating":
                                parameters.push(`minbggrating=${minRating}`);
                                break;
                        }
                    }
                }
            }

            urlParams += parameters.join("&");

            let url = `${baseApiAddress}/collection?username=${username}&stats=1${urlParams}`;
            const collectionResponse = await axios.get(url);

            if (collectionResponse.status === 200) {
                const parsedData = parseXml(collectionResponse.data);

                // check number of items
                const totalItems: number = parsedData.items["@_totalitems"];
                setNumberGames(totalItems);

                if (totalItems == 0) {
                    setGames([]);
                    setShownGames([]);
                    return;
                }

                let gamesData = [];

                // wrap in array if only one item present
                if (totalItems == 1) {
                    gamesData.push(parsedData.items.item);
                }
                else {
                    gamesData = parsedData.items.item;
                }

                // sorting games according to ordering
                if (ordering === "ranking") {
                    // TODO: sorting by ranking from backend, makes sense after full ranking functionality present
                }
                else { // alphabetical
                    // sort with name comparator
                    gamesData.sort((a: BoardGameStub, b: BoardGameStub) => {
                        const nameA = a.name["#text"];
                        const nameB = b.name["#text"];
                        return nameA.localeCompare(nameB);
                    })
                }

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
    }, [type, ordering, filtersState, minRating]);

    // update shownGames effect
    useEffect(() => {
        fetchDetails().then(() => setLoading(false));
    }, [games, currentPage]);


    return (
        loading ? <LoadingProgress/> :
            <div className={styles.container}>
                <div className={styles.header}>
                    <CollectionToggle/>
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
                            setLoading(true);
                        }}
                    />
                </div>
            </div>
    )
}

export default CollectionPage;
