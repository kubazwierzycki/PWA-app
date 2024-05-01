import {createContext, ReactElement, ReactNode, useContext} from "react";


const AuthContext = createContext({});

/**
 * Context establishing authorisation logic and access control utility
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const AuthProvider = ({children}: {children: ReactElement}): ReactNode => {

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};