import {useEffect, useState} from "react";
import {getTopGames} from "../../services/boardgames.ts";
import {TopBoardGame} from "../../types/IBoardgames.ts";
import styles from "../../styles/home.module.css"


const GameOfTheDay = () => {

    const [gameOfTheDay, setGameOfTheDay] = useState<TopBoardGame>({} as TopBoardGame);

    useEffect(() => {

        let dayNumber = new Date().getDate();

        getTopGames().then((value) => {
            setGameOfTheDay(value[dayNumber - 1]);
        });
    }, []);

    return (
        <div className={styles.gameOfTheDay}>
            <div>
                {gameOfTheDay?.name?.["@_value"] ?? ""}
            </div>
            <img src={gameOfTheDay?.thumbnail?.["@_value"] ?? ""} alt="game of the day thumbnail" />
        </div>
    )
}

export default GameOfTheDay;
