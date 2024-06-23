import styles from "../../styles/comparing.module.css"
import {Button, Typography} from "@mui/material";
import BoardGameCard from "../../components/BoardGameCard.tsx";
import {ReactNode, useEffect, useState} from "react";
import {useBoardgamesContext} from "../../contexts/BoardgamesContext.tsx";
import {getRanking, saveRanking} from "../../services/rankings.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {BoardGameDetails} from "../../types/IBoardgames.ts";
import {getGameDetails} from "../../services/boardgames.ts";
import FinishAndSaveModal from "../../components/modals/comparing/FinishAndSaveModal.tsx";
import CompareModal from "../../components/modals/comparing/CompareModal.tsx";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

/**
 * Enum type for single comparison winner game
 */
enum Winner {
    LEFT,
    RIGHT,
    UNKNOWN
}

/**
 * Page for updating user's personal game ranking based on comparing games pair by pair
 * @returns {ReactNode}
 */
const ComparingGamesPage = (): ReactNode => {

    const {uuid} = useAuth();
    const token = Cookies.get("token");

    const navigate = useNavigate();

    // state of current pair choice
    const [chosen, setChosen] = useState<Winner>(Winner.UNKNOWN);

    // finish modal popup
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => setModalOpen(true);

    const handleCardClick = (val: Winner) => {
        setChosen(val);
    }

    // compare error modal state
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    // save success modal state
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const handleNextClick = () => {
        if (chosen === Winner.UNKNOWN) {
            // winner has not been chosen - error
            setErrorModalOpen(true);
            return;
        }
        updateRanking(chosen);
        setChosen(Winner.UNKNOWN);
    }

    /**
     * Function for choosing two games to be compared in the iteration
     * Chooses games randomly
     * Avoids using same game twice in iteration
     */
    const chooseTwoGames = () => {
        if (ranking === undefined || ranking.length === 0) return null;

        let index1 = -1;
        let index2 = -1;
        // avoid choosing the same game twice
        while (index1 === index2) {
            index1 = Math.floor(Math.random() * ranking.length);
            index2 = Math.floor(Math.random() * ranking.length);
        }

        setGame1Index(index1);
        setGame2Index(index2);
    }

    /**
     * Function to update the rank for a specific game id
     * @param {string} id - BGG id of the game
     * @param {number} newRank - new established ranking value for this game
     */
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

    /**
     * Function updating ranking based on single comparison iteration result
     * @param {@link Winner} winner - determines which game won in this iteration
     */
    const updateRanking = (winner: Winner) => {
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

    const saveSession = async () => {
        const response = await saveRanking(uuid, token!, ranking);
        console.log(response);
        if (response == 200) {
            setSuccessModalOpen(true);
            navigate("boardgames/collection");
        }
        else {

        }
    }

    const finishComparing = () => {
        if (chosen !== Winner.UNKNOWN) {
            // save last pair result
            handleNextClick();
        }
        // send final session ranking to be saved on backend
        saveSession().then();
    }

    // current state of user's boardgames ranking
    const {ranking, setRanking} = useBoardgamesContext();

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
                <div className={styles.cardContainer} onClick={() => handleCardClick(Winner.LEFT)}>
                    <BoardGameCard
                        chosen={chosen}
                        val={Winner.LEFT}
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
                <div className={styles.cardContainer}  onClick={() => handleCardClick(Winner.RIGHT)}>
                    <BoardGameCard
                        chosen={chosen}
                        val={Winner.RIGHT}
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
                    onClick={handleNextClick}
                >
                    Next pair
                </Button>
            </div>
            <FinishAndSaveModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleFinish={finishComparing}
            />
            <CompareModal
                compareModalOpen={errorModalOpen}
                setCompareModalOpen={setErrorModalOpen}
                header="Comparing error"
                text="Please choose better game"
                actionText="Close"
                mode="error"
            />
            <CompareModal
                compareModalOpen={successModalOpen}
                setCompareModalOpen={setSuccessModalOpen}
                header="Success"
                text="The updated ranking has been saved"
                actionText="Ok"
                mode="success"
            />
        </div>
    )
}

export default ComparingGamesPage;
