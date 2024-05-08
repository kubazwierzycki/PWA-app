import {useAuth} from "../contexts/AuthContext.tsx"
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import authorizationService from '../services/authorization.tsx';
import Button from "@mui/material/Button";
import { ReactNode } from "react";

/**
 * Component with sign out logic.
 * @returns {ReactNode}
 */
const SignOutButton = () : ReactNode =>{
    const {setToken, uuid, setUuid} = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () =>{
        setUuid('');
        const token = Cookies.get('token');
        if(token){
            authorizationService.signOut(token, uuid)
            .then(res => {console.log(res);})
            .catch(err => {console.log(err);})
            Cookies.remove("token");
            Cookies.remove("uuid");
            setToken('')
            setUuid('')
            navigate("/")
        } else {
            alert("Token do not exist")
        }
    };

    return(
        <div>
            {uuid != '' ? <Button onClick={handleSignOut}>Sign Out</Button> : false}    
        </div>
    )
}

export default SignOutButton;
