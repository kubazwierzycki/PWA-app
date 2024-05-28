import { ReactNode } from "react";
import UserDetailsUpdateForm from "../components/forms/UserDetailsUpdateForm";
import UserDetails from "../components/UserDetails";

/**
 * User profile and settings page
 * @returns {ReactNode}
 */
const Profile = (): ReactNode => {
    return (
        <div>
            Profile
            <UserDetails></UserDetails>
            <UserDetailsUpdateForm></UserDetailsUpdateForm>
        </div>
    );
};

export default Profile;
