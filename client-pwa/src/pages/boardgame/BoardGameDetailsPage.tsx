import {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styles from "../../styles/boardGameDetails.module.css"
import {getGameDetails} from "../../services/boardgames.ts";
import {BoardGameDetails, BoardGameStub} from "../../types/IBoardgames.ts";
import {clearCharEntities} from "../../utils/DescriptionParser.ts";
import {Stack, Typography} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import StarIcon from '@mui/icons-material/Star';
import {getRatingColor, renderStar} from "../../utils/RatingUtil.tsx";
import LoadingProgress from "../../components/LoadingProgress.tsx";
import {useBoardgamesContext} from "../../contexts/BoardgamesContext.tsx";


const BoardGameDetailsPage = (): ReactNode => {

    // game id from page routing url parameter
    const { gameId } = useParams<{ gameId: string }>();

    // state with game details
    const [game, setGame] = useState({} as BoardGameDetails);

    // user related details
    const [comment, setComment] = useState<string>("");
    const [userBGGgrade, setUserBGGgrade] = useState<string>("N/A");

    const {games} = useBoardgamesContext();

    // state should be true when data not ready yet
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGameDetails = async () => {
            const gameDetails = await getGameDetails(gameId);
            setGame(gameDetails[0]);
        };

        fetchGameDetails().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        const _game = games.filter((value: BoardGameStub) =>
            value["@_objectid"] === gameId
        )[0];
        const commentText = _game?.comment || "";
        setComment(clearCharEntities(commentText));
        setUserBGGgrade(_game?.stats?.rating?.["@_value"] || "N/A");
    }, [game]);

    let rating = game.statistics?.ratings?.average["@_value"] || "0.0";

    if (loading) {
        return (
            <LoadingProgress />
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.imageContainer}>
                    <img alt="game_image" src={game.image} className={styles.image}/>
                </div>
                <div className={styles.info}>
                    <div className={styles.tile}>
                        <div className={styles.element}>
                            <Typography variant="h5">
                                {game.yearpublished?.["@_value"] || ""}
                            </Typography>
                        </div>
                        <div className={styles.element}>
                            <Stack direction="row" useFlexGap>
                                <PersonIcon fontSize="large"/>
                                <Typography variant="h5">
                                    {game.minplayers?.["@_value"] || ""} - {game.maxplayers?.["@_value"] || ""}
                                </Typography>
                            </Stack>
                        </div>
                    </div>
                    <div className={styles.tile}>
                        <div className={styles.element}>
                            <Stack direction="row" useFlexGap>
                                <SentimentSatisfiedAltIcon fontSize="large"/>
                                <Typography variant="h5">
                                    {game.minage?.["@_value"] || ""}+
                                </Typography>
                            </Stack>
                        </div>
                        <div className={styles.element}>
                            <Stack direction="row" useFlexGap>
                                <AccessTimeIcon fontSize="large"/>
                                <Typography variant="h5">
                                    {game.playingtime?.["@_value"] || ""} min
                                </Typography>
                            </Stack>
                        </div>
                    </div>
                    <div className={styles.tile}>
                        <Stack direction="column" useFlexGap>
                            <Stack direction="row">
                                <MilitaryTechIcon fontSize="large"/>
                                <Typography variant="h5" sx={{marginRight: "20px"}}>
                                    BGG community:
                                </Typography>
                            </Stack>
                            <Typography variant="h5">
                                <b>
                                    <span style={{color: getRatingColor(parseFloat(rating))}}>
                                        {rating}
                                    </span>
                                </b>
                                {
                                    renderStar(parseFloat(rating), getRatingColor(parseFloat(rating)))
                                }
                            </Typography>
                        </Stack>
                    </div>
                    <div className={styles.tile}>
                        <Stack direction="column" useFlexGap>
                            <Stack direction="row">
                                <StarIcon fontSize="large"/>
                                <Typography variant="h5" sx={{marginRight: "20px"}}>
                                    Your BGG grade:
                                </Typography>
                            </Stack>
                            <Typography variant="h5">
                                {
                                    userBGGgrade === "N/A" ? userBGGgrade :
                                        (
                                            <div>
                                                <b>
                                                    <span style={{color: getRatingColor(parseFloat(userBGGgrade))}}>
                                                        {userBGGgrade}
                                                    </span>
                                                </b>
                                                {
                                                    renderStar(parseFloat(rating), getRatingColor(parseFloat(userBGGgrade)))
                                                }
                                            </div>
                                        )
                                }
                            </Typography>
                        </Stack>
                    </div>
                </div>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.title}>
                    <h1><b><i>{game.name?.["@_value"] || ""}</i></b></h1>
                </div>
                <div className={styles.description}>
                    <hr/>
                    {clearCharEntities(game.description)}
                    <hr/>
                    Comment:
                    <br/>
                    <i>
                        {comment}
                    </i>
                </div>
            </div>
        </div>
    )
}

export default BoardGameDetailsPage;
