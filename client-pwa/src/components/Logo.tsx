import {ReactNode} from "react";

/**
 * Small rectangular version of logo component
 * @returns {ReactNode}
 */
const Logo = (): ReactNode => {


    return (
        <div>
            <img src={"/logo.png"} alt={"CoGame"}/>
        </div>
    )
}

export default Logo;
