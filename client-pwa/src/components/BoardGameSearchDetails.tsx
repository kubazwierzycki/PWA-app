import { alpha, Box, Typography } from "@mui/material";
import { BggGameDetailsFromXML } from "../services/bgg";

import PersonIcon from '@mui/icons-material/Person';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const BoardGameSearchDetails = ({details}: {details : BggGameDetailsFromXML}) =>{
    const desc = details.description
        .split(/[.!?]/)
        .map(sentence => sentence.trim())
        .filter(Boolean)[0]|| "";

    const txt = document.createElement("textarea");
    txt.innerHTML = desc;

 return(
    <>  
        {/* {details.thumbnail ? <img src={details.thumbnail}></img> : null} */}
        <Box sx={{display:"flex", justifyContent:"left", pl:2, color:(theme) => alpha(theme.palette.text.secondary,1)}}>
            <Box sx={{display:"flex", pr:0.8, alignItems:"center"}}>
                <Typography variant="subtitle1" sx={{pr:0.2, fontWeight: 500}}>
                    Year: {details.yearpublished ? details.yearpublished : "?"}
                </Typography> 
               <CalendarMonthIcon fontSize="small"/>
            </Box>
            <Box sx={{display:"flex", pr:0.8, alignItems:"center"}}>
                <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                    Players: {details.minplayers}-{details.maxplayers}
                </Typography><PersonIcon/>
            </Box>
            {(  details.minplaytime !== "0" &&
                details.maxplaytime !== "0" &&
                details.minplaytime !== details.maxplaytime) ?
                    <Box sx={{display:"flex", pr:0.8, alignItems:"center"}} >
                        <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                            Time: {details.minplaytime}-{details.maxplaytime}
                        </Typography><HourglassBottomIcon fontSize="small"/>
                    </Box>
                    : (details.playingtime !== "0") ? 
                    <Box sx={{display:"flex", pr:0.8, alignItems:"center"}} >
                    <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                        Time: {details.playingtime}
                    </Typography><HourglassBottomIcon fontSize="small"/></Box> : null
            }
            <Box sx={{display:"flex", alignItems:"center"}}>
                <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                    Age: {details.minage}
                </Typography><EscalatorWarningIcon />
            </Box>
        </Box>
        <Typography variant="body1" sx={{my:1, textAlign:"left", px:2, color:(theme) => alpha(theme.palette.text.secondary,0.9)}}>{txt.value}</Typography>
    </>
 )
}

export default BoardGameSearchDetails;
