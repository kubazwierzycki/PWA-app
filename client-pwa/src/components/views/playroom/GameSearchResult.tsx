import {Dispatch, ReactNode, SetStateAction} from "react";
import {BoardGameStub} from "../../../types/IBoardgames.ts";
import {Typography} from "@mui/material";
import styles from "../../../styles/createPlayroom.module.css"
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { usePlayroomContext } from "../../../contexts/PlayroomContext.tsx";


interface SearchResultProps {
    game: BoardGameStub
    choice: string
    setChoice: Dispatch<SetStateAction<string>>
    setName: Dispatch<SetStateAction<string>>
}

/**
 * View component presenting single game search result
 * @param {@link BoardGameStub} game - game info object
 * @param {number} choice - game choice state (game id)
 * @param {Dispatch<SetStateAction<number>>} setChoice - game choice id change callback
 * @param {Dispatch<SetStateAction<string>>} setName - game choice name change callback
 * @returns {ReactNode}
 */
const GameSearchResult = ({game, choice, setChoice, setName}: SearchResultProps): ReactNode => {
    const {setGameImgSrc} = usePlayroomContext();

    const gameId = game["@_objectid"];

    const handleClick = () => {
        setChoice(gameId);
        setName(game.name["#text"]);
        setGameImgSrc(game.thumbnail);
    }

    return (
        <div
            className={styles.searchResultContainer}
            style={choice === gameId ? {border: "1px solid green"} : {}}
            onClick={handleClick}
        >
            <img src={game.thumbnail} alt={game.name["#text"]} height="75px"/>
            <div className={styles.searchResultTitle}>
                <Typography sx={{marginLeft: "20px"}} variant="h5">
                    {
                        game.name["#text"]
                    }
                </Typography>
            </div>
            {
                choice === gameId &&
                <div className={styles.chosenResultTick}>
                    <DoneOutlineIcon color={"success"} fontSize={"large"} />
                </div>
            }
        </div>
    )
}

export default GameSearchResult;
