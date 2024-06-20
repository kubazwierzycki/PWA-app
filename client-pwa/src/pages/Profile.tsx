import { ReactNode, useState } from "react";
import UserDetailsUpdateForm from "../components/forms/UserDetailsUpdateForm";
import UserDetails from "../components/UserDetails";
import Box from "@mui/material/Box";

/**
 * User profile and settings page
 * @returns {ReactNode}
 */
const Profile = (): ReactNode => {
    const [choice, setChoice] = useState("");
    return (
        <div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    boxShadow: 1,
                    borderRadius: 2,
                    maxWidth: "300px",
                    p: 2,
                }}
            >
                <UserDetails setChoice={setChoice}></UserDetails>
                <UserDetailsUpdateForm choice={choice}></UserDetailsUpdateForm>
            </Box>
        </div>
    );
};

export default Profile;
