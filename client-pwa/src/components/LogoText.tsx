import logo_text from '../assets/logo/logo_text.png'
import {Link} from "react-router-dom";
import {ReactNode} from "react";


/**
 * Long version of app logo component (with name)
 * @returns {ReactNode}
 */
const LogoText = (): ReactNode => {


    return (
        <div>
            <Link to="/">
                <img src={logo_text} alt="CoGame" style={{maxWidth: "200px"}}/>
            </Link>
        </div>
    )
}

export default LogoText;
