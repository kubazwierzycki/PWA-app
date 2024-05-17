import {ReactNode, useEffect, useState} from "react";
import CollectionToggle from "../../components/CollectionToggle.tsx";
import styles from "../../styles/collections.module.css"
import BoardGameTile from "../../components/BoardGameTile.tsx";
import {Pagination} from "@mui/material";
import axios from "axios";
import {parseXml} from "../../utils/XMLToJSON.ts";


interface BoardGame {
    name: string;
}

/**
 * User game board collection page
 * @returns {ReactNode}
 */
const CollectionPage = (): ReactNode => {

    const username: string = "bhr_79";

    const [games, setGames] = useState<BoardGame[]>([]);

    useEffect(() => {
        const request  = axios({
            method: 'get',
            url: `https://boardgamegeek.com/xmlapi2/collection?username=${username}`,
        })
        request.then(response => setGames(parseXml(response.data).items.item))
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <CollectionToggle />
            </div>
            <div className={styles.body}>
                <BoardGameTile />
                {
                    games.map(game => (
                        <div>{game.name}</div>
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
