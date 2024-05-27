import { ReactNode } from "react";
import UserDetailUpdateForm from "../components/forms/UserDetailUpdateForm";

/**
 * User profile and settings page
 * @returns {ReactNode}
 */
const Profile = (): ReactNode => {
    return (
        <div>
            Profile
            <UserDetailUpdateForm></UserDetailUpdateForm>
        </div>
    );
};

export default Profile;
