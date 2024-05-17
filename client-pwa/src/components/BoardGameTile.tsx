import Paper from "@mui/material/Paper";
import styles from "../styles/boardGameTile.module.css"
import test_thumbnail from "../assets/test_thumbnail.webp"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import {useState} from "react";


const BoardGameTile = () => {

    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

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
                                <b>Game title</b>
                            </div>
                            <div className={styles.description}>Short game description describing game shortly to
                                describe the game so that it is described, as it makes it more descriptive and allows
                                better description of the described game, which we want to describe
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at lacinia ex. Donec quis
                        gravida magna. Suspendisse eu ex sit amet ligula varius ullamcorper eget auctor ante. Nam
                        efficitur vehicula velit et pretium. Nunc vel justo imperdiet, blandit lacus eget, elementum
                        nulla. Pellentesque a massa est. Nullam aliquam nisi eu laoreet egestas. In hac habitasse platea
                        dictumst. Donec imperdiet orci non tortor volutpat, sit amet luctus velit scelerisque.
                        Vestibulum non cursus orci.
                        Sed ut lacinia urna. Duis imperdiet neque vel faucibus rhoncus. In eu dictum dui. Duis pretium
                        dui quis tortor iaculis mattis. In a aliquam elit. Curabitur dignissim blandit velit at mollis.
                        Maecenas neque nisi, imperdiet sed tellus non, consectetur aliquet lectus. Nam imperdiet semper
                        lacus in pellentesque.
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default BoardGameTile;
