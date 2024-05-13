import {ReactNode} from "react";
import SignInForm from "../components/forms/SignInForm.tsx";


/**
 * SignIn page
 * @returns {ReactNode}
 */
const SignIn = (): ReactNode => {


    return (
        <div>
            Sign In 
            <SignInForm/>
        </div>
    )
}

export default SignIn;
