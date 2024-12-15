import {
    createContext, Dispatch,
    ReactElement,
    ReactNode, SetStateAction,
    useContext, useEffect,
    useState
} from "react";
import {BoardGameRank, BoardGameStub} from "../types/IBoardgames.ts";
import {useAuth} from "./AuthContext.tsx";
import {getGames} from "../services/boardgames.ts";
import {getRanking} from "../services/rankings.ts";

interface BoardgamesContextType {
    games: BoardGameStub[]
    setGames: Dispatch<SetStateAction<BoardGameStub[]>>
    ranking: BoardGameRank[]
    setRanking: Dispatch<SetStateAction<BoardGameRank[]>>
}

export const BoardgamesContext = createContext<BoardgamesContextType>({} as BoardgamesContextType);

/**
 * Context storing current state of user collection (owned) for ranking reference across the page
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const BoardgamesContextProvider = ({children}: {children: ReactElement}): ReactNode => {

    // list of games for collection reference
    const [games, setGames] = useState<BoardGameStub[]>([] as BoardGameStub[]);

    // ranking list from backend
    const [ranking, setRanking] = useState<BoardGameRank[]>([] as BoardGameRank[]);

    const {user, uuid} = useAuth();

    useEffect(() => {
        if (uuid === "" || user.bggUsername === '') {
            return;
        }
        getGames(user.bggUsername, "&subtype=boardgame&excludesubtype=boardgameexpansion")
            .then(value => setGames(value));
        getRanking(uuid)
            .then(value => setRanking(value));
    }, [user.bggUsername]);

    return (
        <BoardgamesContext.Provider value={{
            games,
            setGames,
            ranking,
            setRanking
        }}>
            {children}
        </BoardgamesContext.Provider>
    )
}

export const useBoardgamesContext = () => {
    return useContext(BoardgamesContext);
};
