import logo_hourglass from '../../assets/logo/logo_hourglass.png'
import {ReactNode} from "react";

/**
 * Small rectangular version of logo component
 * @returns {ReactNode}
 */
const LogoHourglass = (): ReactNode => {


    return (
        <div>
            <img src={logo_hourglass} alt={"CoGame"}/>
        </div>
    )
}

export default LogoHourglass;
