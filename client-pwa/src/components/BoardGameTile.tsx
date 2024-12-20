import Paper from "@mui/material/Paper";
import styles from "../styles/boardGameTile.module.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ReactNode, useEffect, useState} from "react";
import {getRatingColor, renderStar} from "../utils/RatingUtil.tsx";
import {Button, Card, Stack, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NumbersIcon from '@mui/icons-material/Numbers';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import {Link} from "react-router-dom";
import {BoardGameItem} from "../types/IBoardgames.ts";
import {useBoardgamesContext} from "../contexts/BoardgamesContext.tsx";


/**
 * Component presenting short information about single board game
 * Expandable for more details
 * @param {BoardGameItem} data - fetched data for presented board game (with details)
 * @returns ReactNode
 */
const BoardGameTile = ({data}: {data: BoardGameItem}): ReactNode => {

    const [expanded, setExpanded] = useState(false);

    const [shortDescription, setShortDescription] = useState("");
    const [communityRating, setCommunityRating] = useState("0.00");
    const [rank, setRank] = useState("");

    const [gameRating, setGameRating] = useState<string>("0.00");

    const {ranking} = useBoardgamesContext();

    useEffect(() => {
        //setDescription(data?.details?.description || "");
        setShortDescription(data?.details?.shortDescription || "");
        let bggRating = data?.details?.statistics?.ratings?.average?.["@_value"] || "0";
        let bbgRatingNum = parseFloat(bggRating);
        bggRating = bbgRatingNum.toFixed(2);
        setCommunityRating(bggRating);
        let rank = data?.details?.statistics?.ratings?.ranks?.rank[0]?.["@_value"] || "Not ranked";
        setRank(rank);
    }, [data.details]);

    useEffect(() => {
        const item = ranking.filter(item => item.gameId === data["@_objectid"])[0];
        if (item !== undefined) {
            let ratingNum = parseFloat(item.rating.toString());
            setGameRating(
                ratingNum.toFixed(2)
            );
        }
    }, [ranking]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    return (
        <div>
            <Paper>
                <div className={`${styles.wrapper} ${expanded ? styles.expanded : ''}`} onClick={toggleExpanded}>
                    <div className={styles.container}>
                        <div className={styles.thumbnail}>
                            <img alt="thumbnail" src={data.details.thumbnail}/>
                        </div>
                        <div className={styles.text}>
                            <div className={styles.title}>
                                <b>
                                    {data.name["#text"]}
                                </b>
                            </div>
                            <div className={styles.description}>
                                {shortDescription}
                            </div>
                        </div>
                        <div className={styles.rating}>
                            <b>
                                <span style={{color: getRatingColor(parseFloat(gameRating))}}>
                                    {gameRating}
                                </span>
                            </b>
                            {
                                renderStar(parseFloat(gameRating), getRatingColor(parseFloat(gameRating)))
                            }
                        </div>
                        <div className={styles.expand}>
                            <ExpandMoreIcon fontSize="large"/>
                        </div>
                    </div>
                    <div className={styles.expandedContent} style={{display: expanded ? "block" : "none"}}>
                        <hr/>
                        <div className={styles.infoCards}>
                            <Card className={styles.card}>
                                <Typography variant="h5">
                                    {data.details.yearpublished["@_value"]}
                                </Typography>
                            </Card>
                            <Card className={styles.card}>
                                <Stack direction="row" useFlexGap>
                                    <PersonIcon fontSize="large"/>
                                    <Typography variant="h5">
                                        {data.details.minplayers["@_value"]} - {data.details.maxplayers["@_value"]}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" useFlexGap>
                                    <SentimentSatisfiedAltIcon fontSize="large"/>
                                    <Typography variant="h5">
                                        {data.details.minage["@_value"]}+
                                    </Typography>
                                </Stack>
                                <Stack direction="row" useFlexGap>
                                    <AccessTimeIcon fontSize="large"/>
                                    <Typography variant="h5">
                                        {data.details.playingtime["@_value"]} min
                                    </Typography>
                                </Stack>
                            </Card>
                            <Card className={styles.card}>
                                <Stack direction="row" useFlexGap>
                                    <MilitaryTechIcon fontSize="large"/>
                                    <Typography variant="h5" sx={{marginRight:"20px"}}>
                                        BGG community:
                                    </Typography>
                                    <Typography variant="h5">
                                        <b>
                                        <span style={{color: getRatingColor(parseFloat(communityRating))}}>
                                            {communityRating}
                                        </span>
                                        </b>
                                        {
                                            renderStar(parseFloat(communityRating), getRatingColor(parseFloat(communityRating)))
                                        }
                                    </Typography>
                                </Stack>
                                <Stack direction="row" useFlexGap>
                                    <NumbersIcon fontSize="large"/>
                                    <Typography variant="h5">
                                        {rank}
                                    </Typography>
                                </Stack>
                            </Card>
                        </div>
                        <div>
                            {shortDescription}
                        </div>
                        <div className={styles.pageLinkContainer}>
                            <Link to={"/boardgames/collection/"+data["@_objectid"]}>
                                <Button>Board game page</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default BoardGameTile;
