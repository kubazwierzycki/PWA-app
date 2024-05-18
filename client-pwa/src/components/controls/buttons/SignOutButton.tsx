import { useAuth } from "../../../contexts/AuthContext.tsx";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import authorizationService from "../../../services/authorization.ts";
import Button from "@mui/material/Button";
import { ReactNode } from "react";
import axios from "axios";

/**
 * Component with sign out logic.
 * @returns {ReactNode}
 */
const SignOutButton = (): ReactNode => {
    const { setToken, uuid, setUuid } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        setUuid("");
        const token = Cookies.get("token");
        if (token) {
            try {
                const res = await authorizationService.signOut(token, uuid);
                console.log(res);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.log(err);
                }
            } finally {
                Cookies.remove("token");
                Cookies.remove("uuid");
                setToken("");
                setUuid("");
                navigate("/");
            }
        } else {
            alert("Token do not exist");
        }
    };

    return (
        <div>
            {uuid != "" ? (
                <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
                false
            )}
        </div>
    );
};

export default SignOutButton;
