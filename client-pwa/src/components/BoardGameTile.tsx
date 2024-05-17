import Paper from "@mui/material/Paper";
import styles from "../styles/boardGameTile.module.css"
import test_thumbnail from "../assets/test_thumbnail.webp"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useState} from "react";

interface NameType {
    "#text": string
}

interface BoardGameDetails {
    description: string
}

interface BoardGameData {
    name: NameType,
    details: BoardGameDetails
}

const BoardGameTile = ({data}: {data: BoardGameData}) => {

    const [expanded, setExpanded] = useState(false);

    const [description, setDescription] = useState("");

    useEffect(() => {
        setDescription(data.details.description)
    }, [data.details]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    console.log(data);

    return (
        <div>
            <Paper>
                <div className={`${styles.wrapper} ${expanded ? styles.expanded : ''}`} onClick={toggleExpanded}>
                    <div className={styles.container}>
                        <div className={styles.thumbnail}>
                            <img alt="thumbnail" src={test_thumbnail}/>
                        </div>
                        <div className={styles.text}>
                            <div className={styles.title}>
                                <b>
                                    {data.name["#text"]}
                                </b>
                            </div>
                            <div className={styles.description}>
                                {description}
                            </div>
                        </div>
                        <div className={styles.rating}>
                            <b>4.9</b>
                            <StarIcon fontSize="medium"/>
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
