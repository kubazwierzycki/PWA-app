import {Card, Typography} from "@mui/material";
import styles from "../styles/comparing.module.css"


interface BoardGameCardProps {
    chosen: number
    val: number
    thumbnail: string
    title: string
    text: string
}

const BoardGameCard = ({chosen, val, thumbnail, title, text}: BoardGameCardProps) => {


    return (
        <div className={styles.cardBox}>
            <Card
                variant="outlined"
                sx={{borderRadius: "20px"}}
                className={styles.innerBox}
            >
                <div className={chosen === val ? styles.chosen : styles.lost}>
                    <div className={styles.cardWrapper}>
                        <div className={styles.thumbnail}>
                            <img src={thumbnail} alt="thumbnail"/>
                        </div>
                        <div className={styles.title}>
                            <Typography variant="h4">
                                <b><u>{title}</u></b>
                            </Typography>
                        </div>
                        <div className={styles.text}>
                            <Typography variant="body1">
                                {text}
                                The game lets you travel in time to decide the fate of 1930s Germany. Become the leader of a political party and ensure your ascension to power.
                            </Typography>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default BoardGameCard;
