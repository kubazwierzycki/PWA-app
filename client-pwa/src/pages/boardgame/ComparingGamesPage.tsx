import styles from "../../styles/comparing.module.css"
import {Button, Typography} from "@mui/material";
import BoardGameCard from "../../components/BoardGameCard.tsx";
import {useState} from "react";
import image from "../../assets/test_thumbnail.webp" // testing only


const ComparingGamesPage = () => {

    // state of current pair choice
    const [chosen, setChosen] = useState(0);

    const handleCardClick = (val: number) => {
        setChosen(val);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="h4">
                    Choose better game:
                </Typography>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.cardContainer} onClick={() => handleCardClick(1)}>
                    <BoardGameCard
                        chosen={chosen}
                        val={1}
                        thumbnail={image}
                        title={"Die Macher"}
                        text={""}
                    />
                </div>
                <div className={styles.vs}>
                    <Typography variant="h5">
                        vs.
                    </Typography>
                </div>
                <div className={styles.cardContainer}  onClick={() => handleCardClick(2)}>
                    <BoardGameCard
                        chosen={chosen}
                        val={2}
                        thumbnail={image}
                        title={"Die Macher"}
                        text={""}
                    />
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
