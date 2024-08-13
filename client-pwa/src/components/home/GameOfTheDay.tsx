import {useEffect, useState} from "react";
import {getTopGames} from "../../services/boardgames.ts";
import {TopBoardGame} from "../../types/IBoardgames.ts";
import styles from "../../styles/home.module.css"
import {styled, Typography} from "@mui/material";
import Box from "@mui/material/Box";

const OverlayBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "100%",
    padding: "10px",
    display: "flex",
    flexDirection: "column"
}));

const GameOfTheDay = () => {

    const [gameOfTheDay, setGameOfTheDay] = useState<TopBoardGame>({} as TopBoardGame);

    useEffect(() => {

        let dayNumber = new Date().getDate();

        getTopGames().then((value) => {
            console.log(gameOfTheDay)
            setGameOfTheDay(value[dayNumber - 1]);
        });
    }, []);

    return (
        <div className={styles.gameOfTheDay}>
            <OverlayBox>
                <Typography variant="h5" textAlign="center">
                    THE GAME OF THE DAY
                </Typography>
                <div>
                    <hr/>
                </div>
                <Typography align="center" fontStyle="italic" variant="h6" lineHeight="50px">
                    {gameOfTheDay?.name?.["@_value"] ?? ""}
                </Typography>
                <Typography variant="body1" textAlign="center" lineHeight="40px">
                    {gameOfTheDay?.yearpublished?.["@_value"] ?? ""}
                </Typography>
                <div className={styles.thumbnail}>
                    <img
                        src={gameOfTheDay?.thumbnail?.["@_value"] ?? ""}
                        alt="game of the day thumbnail"
                        height="100%"
                    />
                </div>
            </OverlayBox>
        </div>
    )
}

export default GameOfTheDay;
