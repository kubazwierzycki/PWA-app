import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useState,
} from "react";


type PlayroomContextType = {
    username : string,
    playerId : string,
    code : string,
    timer: number,
    thumbnailSrc: string,
    setUsername : React.Dispatch<React.SetStateAction<string>>,
    setPlayerId : React.Dispatch<React.SetStateAction<string>>,
    setCode : React.Dispatch<React.SetStateAction<string>>,
    setTimer : React.Dispatch<React.SetStateAction<number>>,
    setThumbnailSrc : React.Dispatch<React.SetStateAction<string>>,
    clearPlayroomContex :  () => void
}

const PlayroomContext = createContext<PlayroomContextType>(
    {} as PlayroomContextType
);

/**
 * Context establishing authorisation logic and access control utility
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const PlayroomProvider = ({children}: {children: ReactElement}): ReactNode => {
    const [username, setUsername] = useState<string>("");
    const [playerId, setPlayerId] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [timer, setTimer] = useState<number>(0);
    const [gameImgSrc, setGameImgSrc] = useState<string>("");

    const clearPlayroomContex = () =>{
        setPlayerId("");
        setUsername("")
        setCode("");
        setTimer(0);
        setGameImgSrc("");
    }

    return (
        <PlayroomContext.Provider
            value={{ username,playerId, code, timer, setUsername, setPlayerId, setCode, setTimer,thumbnailSrc: gameImgSrc, setThumbnailSrc: setGameImgSrc, clearPlayroomContex }}
        >
            {children}
        </PlayroomContext.Provider>
    );
};

export const usePlayroomContext= () => {
    return useContext(PlayroomContext);
};
