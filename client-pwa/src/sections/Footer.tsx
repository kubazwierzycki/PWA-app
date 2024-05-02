import {Box, Stack, Typography} from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import styles from "../styles/footer.module.css"
import Logo from "../components/LogoHourglass.tsx";
import GitHubIcon from '@mui/icons-material/GitHub';
import {Link} from "react-router-dom";
import {ReactNode} from "react";

/**
 * Layout footer component
 * @returns {ReactNode}
 */
const Footer = (): ReactNode => {


    return (
        <div>
            <Fragment>
                <Box width="100%" sx={{bgcolor: "background.paper"}}>
                    <div className={styles.container}>
                        <div className={styles.logo}>
                            <div>
                                <Stack direction="row" alignItems="center">
                                    <Logo />
                                    <div className={styles.mobileExcluded} style={{marginLeft:"10px"}}>
                                        <Typography align={"left"} color={"text.primary"} variant="h5">
                                            CoGame
                                        </Typography>
                                    </div>
                                </Stack>
                            </div>
                        </div>
                        <div className={styles.info}>
                            <div className={styles.box}>
                                <div className={styles.infoElement}>
                                    <a href="https://github.com/kubazwierzycki/PWA-app" target="_blank">
                                        <Stack direction="row" alignItems="center">
                                            <GitHubIcon
                                                sx={{color: 'text.primary', marginRight: '3px'}}
                                                className={styles.footerText}
                                            />
                                            <Typography variant="body1" color="text.primary" className={styles.footerText}>
                                                Github page
                                            </Typography>
                                        </Stack>
                                    </a>
                                </div>
                                <div className={styles.infoElement}>
                                    <Link to={"/about"}>
                                        <Typography align={"left"} color={"text.primary"}>
                                            About
                                        </Typography>
                                    </Link>
                                </div>
                                <div className={styles.infoElement}>
                                    <Typography variant="body1" color="text.primary">
                                        CoGame &copy; 2024
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className={styles.bgg}>
                            <a href="https://boardgamegeek.com/">
                                <img src="/powered_by_bgg.webp" alt="powered by BGG"/>
                            </a>
                        </div>
                    </div>
                </Box>
            </Fragment>
        </div>
    )
}

export default Footer;
