import { ReactNode } from "react";
import SignUpForm from "../components/SignUpForm.tsx";

/**
 * SignUp page
 * @returns {ReactNode}
 */
const SignUp = (): ReactNode => {
    return (
        <div>
            Sign Up
            <SignUpForm />
        </div>
    );
};

export default SignUp;
