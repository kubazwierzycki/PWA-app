import { ReactNode } from "react";
import banner from "../../public/banner1.jpg"
import styles from "../styles/home.module.css"
import Box from "@mui/material/Box";
import {Stack, styled, Typography} from "@mui/material";
import GameOfTheDay from "../components/home/GameOfTheDay.tsx";
import CapabilitiesSlider from "../components/home/CapabilitiesSlider.tsx";
import Logo from "../components/logo/LogoHourglass.tsx";


const OverlayBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    height: "100%",
    border: `2px solid ${theme.palette.divider}`,
    display: 'flex'
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
                        <div className={styles.bannerInnerBox}>
                            <div className={styles.logoBox}>
                                <Stack direction="row" alignItems="center">
                                    <Logo />
                                    <div style={{marginLeft:"10px"}}>
                                        <Typography align={"left"} color={"text.primary"} variant="h3">
                                            CoGame
                                        </Typography>
                                    </div>
                                </Stack>
                            </div>
                            <div className={styles.bannerText}>
                                <hr style={{width: "80%"}}/>
                                <Typography align={"justify"} color={"text.primary"} variant="body1">
                                    Connect your BoardGameGeek account and unlock a world of possibilities with our all-in-one board game companion app. Manage your collection, rank your favorite games, and bring the excitement of tabletop gaming to life with custom tools designed just for you. Whether you're at home or on the go, our app ensures that your game night is always a win!
                                </Typography>
                            </div>
                        </div>
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
