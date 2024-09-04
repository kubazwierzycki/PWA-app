import { ReactNode } from "react";
import SignUpForm from "../components/forms/SignUpForm.tsx";
import styles from "../styles/home.module.css"

/**
 * SignUp page
 * @returns {ReactNode}
 */
const SignUp = (): ReactNode => {
    return (
        <div className={styles.centered}>
            <SignUpForm />
        </div>
    );
};

export default SignUp;
