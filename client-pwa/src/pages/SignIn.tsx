import {ReactNode} from "react";
import SignInForm from "../components/forms/SignInForm.tsx";
import styles from "../styles/home.module.css"


/**
 * SignIn page
 * @returns {ReactNode}
 */
const SignIn = (): ReactNode => {


    return (
        <div className={styles.centered}>
            <SignInForm/>
        </div>
    )
}

export default SignIn;
