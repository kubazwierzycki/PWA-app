import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useState
} from "react";
import {BoardgamesContextType, BoardGameStub} from "../types/IBoardgames.ts";


export const BoardgamesContext = createContext<BoardgamesContextType>({} as BoardgamesContextType);

/**
 * Context storing current state of user collection (owned) for ranking reference across the page
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const BoardgamesContextProvider = ({children}: {children: ReactElement}): ReactNode => {

    const [games, setGames] = useState<BoardGameStub[]>([] as BoardGameStub[]);

    return (
        <BoardgamesContext.Provider value={{
            games,
            setGames
        }}>
            {children}
        </BoardgamesContext.Provider>
    )
}

export const useBoardgamesContext = () => {
    return useContext(BoardgamesContext);
};
