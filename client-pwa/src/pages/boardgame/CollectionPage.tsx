import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import CollectionToggle from "../../components/CollectionToggle.tsx";
import styles from "../../styles/collections.module.css";
import BoardGameTile from "../../components/BoardGameTile.tsx";
import {Pagination} from "@mui/material";
import axios from "axios";
import {clearCharEntities, getShortDescription,} from "../../utils/DescriptionParser.ts";
import axiosRetry from "axios-retry";

import {useCollectionViewContext} from "../../contexts/CollectionViewContext.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useBoardgamesContext} from "../../contexts/BoardgamesContext.tsx";
import {getGameDetails, getGames} from "../../services/boardgames.ts";
import {BoardGameItem, BoardGameRank, BoardGameStub, FiltersState} from "../../types/IBoardgames.ts";
import LoadingProgress from "../../components/LoadingProgress.tsx";


/**
 * User game board collection page
 * Uses {@link CollectionViewContext} that controls view state
 * Supports pagination and view control with {@link CollectionToggle}
 * @returns {ReactNode}
 */
const CollectionPage = (): ReactNode => {

    const { user } = useAuth();

    const {games, setGames, ranking} = useBoardgamesContext();

    // view of the collection sorted according to chosen constraints
    const [sortedCollection, setSortedCollection] = useState([] as BoardGameStub[]);

    const [shownGames, setShownGames] = useState<BoardGameItem[]>([]);
    const [numGames, setNumberGames] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage: number = 10; // number of board games displayed per page

    const getPaginationLen = () => Math.ceil(numGames / perPage);

    // view toggle state from context
    const { type, ordering, filtersState, minRating } =
        useCollectionViewContext();

    // state should be true when data not ready yet
    const {loading, setLoading} = useCollectionViewContext();

    const fetchDetails = async () => {

        if (sortedCollection === undefined || sortedCollection.length === 0) {
            setShownGames([]);
            return;
        }

        // get list of required games
        const ids: string[] = [];
        let start = (currentPage - 1) * perPage;
        // add ids to list
        for (let i = start; i < start + perPage && i < sortedCollection.length; i++) {
            ids.push(sortedCollection[i]["@_objectid"]);
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
        const chosenGames: BoardGameItem[] = sortedCollection
            .slice(start, start + perPage)
            .map((stub) => {
                counter++;
                return {
                    name: stub.name,
                    "@_objectid": stub["@_objectid"],
                    details: gameDetails[counter],
                };
            });

        setShownGames(chosenGames);
    };

    /**
     * Function mapping board games data to obtained ranking
     * Assumes valid data with matching ids
     * @param {@link BoardGameStub[]} gamesData
     * @param {@link BoardGameRank[]} ranking
     * @returns {@link BoardGameStub[]}
     */
    const sortGamesByRanking = (gamesData: BoardGameStub[], ranking: BoardGameRank[]): BoardGameStub[] => {

        if (gamesData === undefined || gamesData.length === 0) return [] as BoardGameStub[];

        // create a map from gameId to the corresponding game data
        const gamesMap = new Map(gamesData.map(game => [game["@_objectid"], game]));

        let result = [];
        // map the ranking array to the sorted games data array
        for (let rank of ranking) {
            let game = gamesMap.get(rank.gameId);
            if (game !== undefined) {
                result.push(game);
            }
        }
        return result;
    };

    const fetchGames = async () => {
        try {
            let urlParams: string = "&";
            let parameters: string[] = [];
            if (type === "owned") {
                parameters.push("own=1");
            } else {
                // "played"
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

            parameters.push("subtype=boardgame")
            parameters.push("excludesubtype=boardgameexpansion")

            urlParams += parameters.join("&");

            let gamesData = await getGames(user.bggUsername, urlParams);

            if (gamesData === undefined) {
                setShownGames([]);
                setGames([]);
                setLoading(false);
                setNumberGames(0);
                return;
            }

            // check number of items
            const totalItems: number = gamesData.length;
            setNumberGames(totalItems);

            if (totalItems == 0) {
                setGames([]);
                setShownGames([]);
                setLoading(false);
                return;
            }

            setGames(gamesData);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Configure axios to retry up to 3 times with a 2-second delay between retries
    axiosRetry(axios, {
        retries: 5,
        retryDelay: (retryCount: number) => retryCount * 1000, // 1 second delay
        retryCondition: (error) => error.response?.status === 202, // retry only for 202 status
    });

    const sortGames = () => {
        let gamesData = [...games];
        // sorting games according to ordering
        if (ordering === "ranking") {
            gamesData = sortGamesByRanking(games, ranking);
        }
        else {
            // alphabetical sort with name comparator
            gamesData.sort((a: BoardGameStub, b: BoardGameStub) => {
                const nameA = a.name["#text"];
                const nameB = b.name["#text"];
                return nameA.localeCompare(nameB);
            });
        }
        setSortedCollection(gamesData);
    }

    // update games list effect
    useEffect(() => {
        fetchGames().then();
    }, [type, ordering, filtersState, minRating]);

    // update shownGames effect
    useEffect(() => {
        if (games === undefined || games.length === 0) {
            return;
        }
        fetchDetails().then(() => setLoading(false));
    }, [currentPage, sortedCollection]);

    // sorting games when games ready
    useEffect(() => {
        if (games === undefined || games.length === 0) {
            setLoading(false);
            return;
        }
        else {
            sortGames();
        }
    }, [games]);


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
