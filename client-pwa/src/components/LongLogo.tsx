import long_logo from '../assets/logo/long_logo.jpeg'
import {Link} from "react-router-dom";
import {ReactNode} from "react";


/**
 * Long version of app logo component (with name)
 * @returns {ReactNode}
 */
const LongLogo = (): ReactNode => {


    return (
        <div>
            <Link to="/">
                <img src={long_logo} alt="CoGame" style={{maxWidth: "200px"}}/>
            </Link>
        </div>
    )
}

export default LongLogo;
