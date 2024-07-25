import {ReactNode} from "react";
import {BoardGameStub} from "../../../types/IBoardgames.ts";
import {Typography} from "@mui/material";

/**
 * View component presenting single game search result
 * @param {@link BoardGameStub} game
 * @returns {ReactNode}
 */
const GameSearchResult = ({game}: {game: BoardGameStub}): ReactNode => {

    const containerStyle = {
        display: "flex",
        padding: "5px 20px",
        alignItems: "center"
    }

    return (
        <div style={containerStyle}>
            <img src={game.thumbnail} alt={game.name["#text"]} height="75px"/>
            <Typography sx={{marginLeft: "20px"}} variant="h5">
                {
                    game.name["#text"]
                }
            </Typography>
        </div>
    )
}

export default GameSearchResult;
