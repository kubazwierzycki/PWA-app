import long_logo from '../assets/logo/long_logo.jpeg'


/**
 * Long version of app logo (with name)
 * @constructor
 */
const LongLogo = () => {


    return (
        <div>
            <img src={long_logo} alt="CoGame" style={{
                maxWidth: "200px"
            }}
            />
        </div>
    )
}

export default LongLogo;