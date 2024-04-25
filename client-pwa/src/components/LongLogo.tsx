import long_logo from '../assets/logo/long_logo.jpeg'
import {Link} from "react-router-dom";


/**
 * Long version of app logo (with name)
 * @constructor
 */
const LongLogo = () => {


    return (
        <div>
            <Link to="/">
                <img src={long_logo} alt="CoGame" style={{maxWidth: "200px"}}/>
            </Link>
        </div>
    )
}

export default LongLogo;
