import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useState,
} from "react";

interface User {
    username: string;
    bggUsername: string;
    bggId: string;
    email: string;
}

type UserAuthContextType = {
    uuid: string;
    setUuid: React.Dispatch<React.SetStateAction<string>>;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const AuthContext = createContext<UserAuthContextType>(
    {} as UserAuthContextType
);

/**
 * Context establishing authorisation logic and access control utility
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const AuthProvider = ({
    children,
}: {
    children: ReactElement;
}): ReactNode => {
    const [uuid, setUuid] = useState("");
    const [token, setToken] = useState("");
    const [user, setUser] = useState<User>({
        username: "undefinedUser",
        bggUsername: "undefinedUser",
        bggId: "undefinedUser",
        email: "undefinedUser",
    });

    return (
        <AuthContext.Provider
            value={{ uuid, setUuid, token, setToken, user, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
