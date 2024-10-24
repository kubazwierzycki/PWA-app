import { ReactNode, useEffect, useState } from "react";
import gameplaysService, { Gameplay } from "../../../services/gameplays"
import {Box, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";

interface GameplayListViewProps{
    userId: string
}

const GameplayListView = ({userId} : GameplayListViewProps): ReactNode => {

    const [gameplays, setGameplays] = useState<Gameplay[] | null>(null);

    useEffect(()=>{
        if(userId) {
            const fetchGameStatis  = async () => {
                try{
                    setGameplays(await gameplaysService.getGameplays(userId));
                } catch {
                    setGameplays(null);
                }
            }

            fetchGameStatis();
        }
    }, [userId])

    return(
        <>
        { gameplays ? 
            <List sx={{ 
                width: '100%', 
                maxWidth: 600, 
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: '40vh',
                '& ul': { padding: 0 },
            }}>
            {gameplays.map((gameplay,index) => (
                <>
                    <ListItem
                    key={gameplay.uuid}
                    disableGutters
                    sx={{px: 2}}
                    >
                    <ListItemText 
                        primary={
                            <Grid container columnSpacing={{ xs: 1}} sx={{justifyContent:"space-between"}} >
                                <Grid item xs={8}>
                                    <Typography variant="subtitle1">
                                        {gameplay.game} 
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" sx={{textAlign:"right"}}>
                                        {gameplay.date}
                                    </Typography>
                                </Grid>
                            </Grid>
                        } 
                        secondary=
                        {
                            <>
                            <Typography variant="subtitle2">
                                Winner: {gameplay.winner}
                            </Typography>
                            <Typography variant="subtitle2">
                                Players:  {gameplay.players.map(p=> ` ${p}`).join(`,`)}
                            </Typography>
                            </>
                        }/>
                    </ListItem>
                    <Divider variant="middle" />
                 </>
            ))}
            </List> : null
        }
        </>
    )
}

export default GameplayListView;
