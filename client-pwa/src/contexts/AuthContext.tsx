import {createContext, ReactElement, ReactNode, useContext, useState} from "react";

type UserAuthContextType = {
    uuid: string;
    setUuid: React.Dispatch<React.SetStateAction<string>>;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
  }

const AuthContext = createContext<UserAuthContextType>({} as UserAuthContextType);

/**
 * Context establishing authorisation logic and access control utility
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const AuthProvider = ({children}: {children: ReactElement}): ReactNode => {
    const [uuid, setUuid] = useState('');
    const [token, setToken] = useState('');

    return (
        <AuthContext.Provider value={{uuid, setUuid, token, setToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};