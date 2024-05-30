import {Card} from "@mui/material";
import styles from "../styles/comparing.module.css"



const BoardGameCard = ({chosen, val}: {chosen: number, val: number}) => {


    return (
        <div className={styles.cardBox}>
            <Card
                variant="outlined"
                sx={{borderRadius: "20px"}}
                className={styles.innerBox}
            >
                <div className={chosen === val ? styles.chosen : styles.lost}>

                </div>
            </Card>
        </div>
    )
}

export default BoardGameCard;
