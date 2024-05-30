import styles from "../../styles/comparing.module.css"
import {Button, Typography} from "@mui/material";


const ComparingGamesPage = () => {


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="h4">
                    Choose better game:
                </Typography>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.cardContainer}>

                </div>
                <div className={styles.vs}>
                    <Typography variant="h5">
                        vs.
                    </Typography>
                </div>
                <div className={styles.cardContainer}>

                </div>
            </div>
            <div className={styles.next}>
                <Button variant="outlined">
                    Next pair
                </Button>
            </div>
        </div>
    )
}

export default ComparingGamesPage;
