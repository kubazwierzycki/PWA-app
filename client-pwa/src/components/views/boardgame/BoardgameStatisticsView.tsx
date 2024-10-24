
import { ReactNode, useEffect, useState } from "react";
import experienceService, { GameStatistic } from "../../../services/experience.ts"
import { Box, Typography } from "@mui/material";
import { EmojiEvents, Schedule, SportsEsports } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
interface BoardgameStatisticsViewProps {
    userId: string
    gameId: string
}

/**
 * View component showing statistics
 *  * @param {string} userId
 * @param {string} gameId
 * @returns {ReactNode}
 */


const BoardgameStatisticsView = ({userId, gameId} : BoardgameStatisticsViewProps): ReactNode => {

    const [gameStatistics, setGameStatistics] = useState<GameStatistic | null>(null)

    useEffect(()=>{
        const fetchGameStatis  = async () => {
            try{
                setGameStatistics(await experienceService.getStatistic(userId, gameId));
            } catch {
                setGameStatistics(null);
            }
        }

        fetchGameStatis();
    }, [])

    return(
        <>
        <Typography variant="h5" sx={{mt:1}}>Statistics:</Typography>
        <Box sx={{display:"flex", mt:0.5}}>
            {gameStatistics ?
                <>
                <Box sx={{mr:3}}>
                    <Typography variant="body1">
                         Number of plays: {gameStatistics.numberOfPlays}
                    </Typography>
                    <SportsEsports sx={{color: blue[300]}}/>
                </Box>
                <Box sx={{mr:3}}>
                    <Typography variant="body1">
                        Number of wins: {gameStatistics.numberOfWins}
                    </Typography>
                    <EmojiEvents sx={{color: blue[300]}}/>
                </Box>
                <Box sx={{mr:3}}>
                    <Typography variant="body1">
                        First play: {gameStatistics.firstPlay}
                    </Typography>
                    <Schedule sx={{color: blue[300]}}/>
                </Box>
                <Box>
                    <Typography variant="body1">
                        Last play {gameStatistics.lastPlay}
                    </Typography>
                    <Schedule sx={{color: blue[300]}}/>
                </Box>
                    {/* <Typography>Avg rating {gameStatistics.avgRating}</Typography> */}
                </>
                : <Typography variant="body1">
                    Take part in games to see your statistics"
                </Typography> }
        </Box>
    </>
    )
}

export default BoardgameStatisticsView;
