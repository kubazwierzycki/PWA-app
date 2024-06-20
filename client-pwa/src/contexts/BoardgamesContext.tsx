import {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";

interface NameType {
    "#text": string
}

interface BoardGameStub {
    name: NameType,
    "@_objectid": string
}

type BoardgamesContextType = {
    games: BoardGameStub[],
    setGames: Dispatch<SetStateAction<BoardGameStub[]>>,
}

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
