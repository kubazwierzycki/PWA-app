import Paper from "@mui/material/Paper";
import styles from "../styles/boardGameTile.module.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import {useEffect, useState} from "react";
import {getRatingColor} from "../utils/RatingUtil.ts";

interface NameType {
    "#text": string
}

interface BoardGameDetails {
    description: string,
    shortDescription: string,
    statistics: {ratings: BoardGameStats}
}

interface BoardGameStats {
    usersRated: string,
    average: {"@_value": string},
    owned: string
}

interface BoardGameData {
    name: NameType,
    details: BoardGameDetails,
    thumbnail: string
}


const BoardGameTile = ({data}: {data: BoardGameData}) => {

    const [expanded, setExpanded] = useState(false);

    const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [rating, setRating] = useState("0.00");

    useEffect(() => {
        setDescription(data?.details?.description || "");
        setShortDescription(data?.details?.shortDescription || "");
        let rating = data?.details?.statistics?.ratings?.average?.["@_value"] || "0";
        let ratingNum = parseFloat(rating);
        rating = ratingNum.toFixed(2);
        setRating(rating);
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
                            <img alt="thumbnail" src={data.thumbnail}/>
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
                                {
                                    <span style={{color: getRatingColor(parseFloat(rating))}}>
                                        {rating}
                                    </span>
                                }
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
                        {description}
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default BoardGameTile;
