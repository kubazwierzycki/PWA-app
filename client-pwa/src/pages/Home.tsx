import { ReactNode } from "react";
import banner from "../../public/banner1.jpg"
import styles from "../styles/home.module.css"
import Box from "@mui/material/Box";
import {styled} from "@mui/material";
import GameOfTheDay from "../components/home/GameOfTheDay.tsx";
import CapabilitiesSlider from "../components/home/CapabilitiesSlider.tsx";


const OverlayBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "100%"
}));


/**
 * Website homepage
 * @returns {ReactNode}
 */
const Home = (): ReactNode => {


    return (
        <div className={styles.container}>
            <div className={styles.bannerWrapper}>
                <div className={styles.bannerOverlay}>
                    <OverlayBox>

                    </OverlayBox>
                </div>
                <div className={styles.banner}>
                    <img src={banner} alt={"CoGame banner"} width={"100%"}/>
                </div>
            </div>
            <div className={styles.rowWrapper}>
                <CapabilitiesSlider />
                <GameOfTheDay />
            </div>
        </div>
    )
}

export default Home;
