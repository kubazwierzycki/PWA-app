import {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styles from "../../styles/boardGameDetails.module.css"
import {getGameDetails} from "../../services/boardgames.ts";
import {BoardGameDetails} from "../../types/IBoardgames.ts";


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
