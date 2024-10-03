import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useState,
} from "react";

type PlayroomContextType = {
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
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

    const [code, setCode] = useState("");

    return (
        <PlayroomContext.Provider
            value={{ code, setCode }}
        >
            {children}
        </PlayroomContext.Provider>
    );
};

export const usePlayroomContext= () => {
    return useContext(PlayroomContext);
};
