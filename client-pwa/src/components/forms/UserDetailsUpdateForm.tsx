import { ReactNode } from "react";
import BggUsernameUpdateForm from "./BggUsernameUpdateForm.tsx";
import EmailUpdateForm from "./EmailUpdateForm.tsx";
import PasswordUpdateForm from "./PasswordUpdateForm.tsx";

/**
 *
 * @returns {ReactNode}
 */
export default function UserDetailsUpdateForm({
    choice,
}: {
    choice: string;
}): ReactNode {
    switch (choice) {
        case "bggUsername":
            return <BggUsernameUpdateForm />;
        case "email":
            return <EmailUpdateForm />;
        case "password":
            return <PasswordUpdateForm />;
        default:
    }
}
