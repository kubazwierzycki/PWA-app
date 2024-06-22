import styles from "../../styles/comparing.module.css"
import {Button, Modal, Stack, Typography} from "@mui/material";
import BoardGameCard from "../../components/BoardGameCard.tsx";
import {useEffect, useState} from "react";
import {Box} from "@mui/system";
import {useBoardgamesContext} from "../../contexts/BoardgamesContext.tsx";
import {getRanking} from "../../services/rankings.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {BoardGameDetails} from "../../types/IBoardgames.ts";
import {getGameDetails} from "../../services/boardgames.ts";


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

    const chooseTwoGames = () => {
        if (ranking === undefined || ranking.length === 0) return null;

        const index1 = Math.floor(Math.random() * ranking.length);
        const index2 = Math.floor(Math.random() * ranking.length);

        setGame1Index(index1);
        setGame2Index(index2);
    }

    // Function to update the rank for a specific id
    const updateRank = (id: string, newRank: number) => {
        setRanking(prevRankings => {
            return prevRankings.map(rank => {
                if (rank.gameId === id) {
                    return { ...rank, rating: newRank };
                }
                return rank;
            });
        });
    };

    const updateRanking = (winner: number) => {
        const id1 = ranking[game1Index].gameId;
        const id2 = ranking[game2Index].gameId;
        const initial1 = ranking[game1Index].rating;
        const initial2 = ranking[game2Index].rating;
        console.log(initial1, initial2)
        // TODO: switch to real updating logic
        switch (winner) {
            case 1:
                // left game won
                updateRank(id1, initial2);
                updateRank(id2, initial1);
                break;
            case 2:
                // right game won
                updateRank(id1, initial2);
                updateRank(id2, initial1);
                break;
            default:
                break;
        }
    }

    // current state of user's boardgames ranking
    const {ranking, setRanking} = useBoardgamesContext();

    const {uuid} = useAuth();

    // fetch ranking data from backend on load
    useEffect(() => {
        const fetchRankings = async () => {
            const data = await getRanking(uuid);
            setRanking(data);
        };

        if (uuid !== "") {
            fetchRankings().then();
        }
    }, [uuid]);

    // ids of the games currently chosen for comparison
    const [game1Index, setGame1Index] = useState<number>(-1);
    const [game2Index, setGame2Index] = useState<number>(-1);

    // game details for the games currently chosen for comparison
    const [game1, setGame1] = useState<BoardGameDetails>({} as BoardGameDetails);
    const [game2, setGame2] = useState<BoardGameDetails>({} as BoardGameDetails);

    // get details for the first game when id is set
    useEffect(() => {
        if (game1Index === -1) return;
        const game1Id = ranking[game1Index].gameId;
        const fetchDetails = async (gameId: string) => {
            const data = await getGameDetails(gameId);
            setGame1(data[0]);
        };
        fetchDetails(game1Id).then();
    }, [game1Index]);

    // get details for the second game when id is set
    useEffect(() => {
        if (game2Index === -1) return;
        const game2Id = ranking[game2Index].gameId;
        const fetchDetails = async (gameId: string) => {
            const data = await getGameDetails(gameId);
            setGame2(data[0]);
        };
        fetchDetails(game2Id).then();
    }, [game2Index]);

    useEffect(() => {
        chooseTwoGames();
    }, [ranking]);

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
                        thumbnail={game1.thumbnail}
                        title={game1.name?.["@_value"] || "Title"}
                        text={game1.shortDescription}
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
                        thumbnail={game2.thumbnail}
                        title={game2.name?.["@_value"] || "Title"}
                        text={game2.shortDescription}
                    />
                </div>
            </div>
            <div className={styles.next}>
                <Button
                    variant="contained" sx={{marginRight: "20px"}}
                    onClick={handleModalOpen}
                >
                    Finish and Save
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => updateRanking(chosen)}
                >
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
