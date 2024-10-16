import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useState,
} from "react";


type PlayroomContextType = {
    username : string,
    code : string,
    timer: number,
    gameImgSrc: string,
    setUsername : React.Dispatch<React.SetStateAction<string>>,
    setCode : React.Dispatch<React.SetStateAction<string>>,
    setTimer : React.Dispatch<React.SetStateAction<number>>,
    setGameImgSrc : React.Dispatch<React.SetStateAction<string>>,
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
    const [code, setCode] = useState<string>("");
    const [timer, setTimer] = useState<number>(100);
    const [gameImgSrc, setGameImgSrc] = useState<string>("");

    return (
        <PlayroomContext.Provider
            value={{ username, code, timer, setUsername, setCode, setTimer,gameImgSrc, setGameImgSrc }}
        >
            {children}
        </PlayroomContext.Provider>
    );
};

export const usePlayroomContext= () => {
    return useContext(PlayroomContext);
};
