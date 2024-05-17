import Paper from "@mui/material/Paper";
import styles from "../styles/boardGameTile.module.css"
import test_thumbnail from "../assets/test_thumbnail.webp"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';


const BoardGameTile = () => {


    return (
        <div>
            <Paper>
                <div className={styles.container}>
                    <div className={styles.thumbnail}>
                        <img alt="thumbnail" src={test_thumbnail} />
                    </div>
                    <div className={styles.text}>
                        <div className={styles.title}>
                            <b>Game title</b>
                        </div>
                        <div className={styles.description}>Short game description describing game shortly to describe the game so that it is described, as it makes it more descriptive and allows better description of the described game, which we want to describe</div>
                    </div>
                    <div className={styles.rating}>
                        <b>4.9</b>
                        <StarIcon fontSize="medium"/>
                    </div>
                    <div className={styles.expand}>
                        <ExpandMoreIcon fontSize="large" cursor={"pointer"}/>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default BoardGameTile;
