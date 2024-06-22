import styles from "../../styles/comparing.module.css"
import {Button, Modal, Stack, Typography} from "@mui/material";
import BoardGameCard from "../../components/BoardGameCard.tsx";
import {useEffect, useState} from "react";
import image from "../../assets/test_thumbnail.webp"
import {Box} from "@mui/system";
import {useBoardgamesContext} from "../../contexts/BoardgamesContext.tsx";
import {getRanking} from "../../services/rankings.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";


const ComparingGamesPage = () => {

    // state of current pair choice
    const [chosen, setChosen] = useState(0);

    // finish modal popup
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalClose = () => setModalOpen(false);

    const handleModalOpen = () => setModalOpen(true);

    const handleCardClick = (val: number) => {
        setChosen(val);
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    // current state of user's boardgames ranking
    const {ranking, setRanking} = useBoardgamesContext();

    const {uuid} = useAuth();

    // fetch ranking data from backend on load
    useEffect(() => {
        const fetchRankings = async () => {
            const data = await getRanking(uuid);
            console.log(data);
            setRanking(data);
        };

        if (uuid !== "") {
            fetchRankings().then();
        }
    }, [uuid]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="h4" sx={{fontSize: "1.5em"}}>
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
                <Button variant="contained" sx={{marginRight: "20px"}} onClick={handleModalOpen}>
                    Finish and Save
                </Button>
                <Button variant="outlined">
                    Next pair
                </Button>
            </div>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
                        Finish and save
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, marginBottom: "10px" }}>
                        Are you sure you want finish comparing and save your ranking update?
                    </Typography>
                    <div className={styles.buttonsContainer}>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setModalOpen(false)} // to be changed
                            >
                                Discard
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => setModalOpen(false)} // to be changed
                            >
                                Save
                            </Button>
                        </Stack>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ComparingGamesPage;
