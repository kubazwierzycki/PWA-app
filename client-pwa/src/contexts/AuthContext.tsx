import {createContext, ReactElement, useContext} from "react";


const AuthContext = createContext({});

/**
 * Context establishing authorisation mechanisms
 * @param children - elements within context
 * @constructor
 */
export const AuthProvider = ({children}: {children: ReactElement}) => {

    // const navigate = useNavigate();

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};