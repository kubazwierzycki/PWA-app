import Paper from "@mui/material/Paper";
import styles from "../styles/boardGameTile.module.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import {useEffect, useState} from "react";
import {getRatingColor} from "../utils/RatingUtil.ts";
import {Button, Card, Stack, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NumbersIcon from '@mui/icons-material/Numbers';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import {Link} from "react-router-dom";

interface NameType {
    "#text": string
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

interface BoardGameStats {
    usersRated: string,
    average: {"@_value": string},
    owned: string,
    ranks: {rank: [{"@_value": string}]}
}

interface BoardGameData {
    name: NameType,
    details: BoardGameDetails
}


const BoardGameTile = ({data}: {data: BoardGameData}) => {

    const [expanded, setExpanded] = useState(false);

    //const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [rating, setRating] = useState("0.00");
    const [rank, setRank] = useState("");

    useEffect(() => {
        //setDescription(data?.details?.description || "");
        setShortDescription(data?.details?.shortDescription || "");
        let rating = data?.details?.statistics?.ratings?.average?.["@_value"] || "0";
        let ratingNum = parseFloat(rating);
        rating = ratingNum.toFixed(2);
        setRating(rating);
        let rank = data?.details?.statistics?.ratings?.ranks?.rank[0]["@_value"];
        setRank(rank);
    }, [data.details]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    const renderStar = (rating: number, color: string) => {
        const style = {color: color};
        if (rating <= 5.0) {
            return (
                <StarOutlineIcon style={style}/>
            )
        }
        else if (rating > 5.0 && rating < 8.0) {
            return (
                <StarHalfIcon style={style} />
            )
        }
        else {
            return (
                <StarIcon style={style}/>
            )
        }
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
                                <span style={{color: getRatingColor(parseFloat(rating))}}>
                                    {rating}
                                </span>
                            </b>
                            {
                                renderStar(parseFloat(rating), getRatingColor(parseFloat(rating)))
                            }
                        </div>
                        <div className={styles.expand}>
                            <ExpandMoreIcon fontSize="large"/>
                        </div>
                    </div>
                    <div className={styles.expandedContent} style={{display: expanded ? "block" : "none"}}>
                        <hr/>
                        <div className={styles.infoCards}>
                            <div>
                                <Card className={styles.card}>
                                    <Typography variant="h5">
                                        {data.details.yearpublished["@_value"]}
                                    </Typography>
                                </Card>
                            </div>
                            <div>
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
                            </div>
                            <div>
                                <Card className={styles.card}>
                                    <Stack direction="row" useFlexGap>
                                        <MilitaryTechIcon fontSize="large"/>
                                        <Typography variant="h5" sx={{marginRight:"20px"}}>
                                            BGG community:
                                        </Typography>
                                        <Typography variant="h5">
                                            <b>
                                            <span style={{color: getRatingColor(parseFloat(rating))}}>
                                                {rating}
                                            </span>
                                            </b>
                                            {
                                                renderStar(parseFloat(rating), getRatingColor(parseFloat(rating)))
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
                        </div>
                        <div>
                            {shortDescription}
                        </div>
                        <div className={styles.pageLinkContainer}>
                            <Link to={"/"}>
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
