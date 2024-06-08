import {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styles from "../../styles/boardGameDetails.module.css"
import {getGameDetails} from "../../services/boardgames.ts";

interface BoardGameStats {
    usersRated: string,
    average: {"@_value": string},
    owned: string,
    ranks: {rank: [{"@_value": string}]}
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

const BoardGameDetailsPage = (): ReactNode => {

    const { gameId } = useParams<{ gameId: string }>();

    const [game, setGame] = useState({} as BoardGameDetails);

    useEffect(() => {
        const fetchGameDetails = async () => {
            const gameDetails = await getGameDetails(gameId);
            setGame(gameDetails[0]);
        };

        fetchGameDetails().then();
    }, []);


    return (
        <div className={styles.container}>
            {gameId}
            <div className={styles.leftPanel}>
                <div className={styles.image}>
                    <img alt="game_image" src={game.thumbnail}/>
                </div>
                <div className={styles.info}>

                </div>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.title}>

                </div>
                <div className={styles.description}>

                </div>
            </div>
        </div>
    )
}

export default BoardGameDetailsPage;
