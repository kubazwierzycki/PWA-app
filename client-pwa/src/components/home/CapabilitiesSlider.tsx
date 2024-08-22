import styles from "../../styles/home.module.css"
import {Tab, Tabs, Typography} from "@mui/material";
import {SyntheticEvent, useState} from "react";


const CapabilitiesSlider = () => {

    const [value, setValue] = useState(0);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const tabsContent = [
        {
            header: "Seamlessly Sync Your Collection",
            text: "Link your BoardGameGeek account and effortlessly manage your board game collection. Stay updated with the latest game data, and track your ever-growing library of tabletop treasures."
        },
        {
            header: "Rate, Rank, and Discover",
            text: "Use our intuitive ranking system to compare and rate your games. Our unique algorithm lets you rank your collection through quick, easy comparisons, helping you identify your favorites and discover hidden gems."
        },
        {
            header: "Enhance Your Game Nights",
            text: "Transform your game night with our Playroom tools. From customizable timers to streamlined scorekeeping, our app makes it easier than ever to focus on the fun while staying organized."
        },
        {
            header: "Wizard-Driven Game Selection",
            text: "Not sure what to play? Let our intelligent wizard choose the perfect game for your group based on your collection, player preferences, and the mood of the evening. Say goodbye to decision fatigue and hello to the best game experience."
        }
    ]

    const CustomTabPanel = ({index}: {index: number}) => {
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
            >
                {
                    value === index &&
                    <div className={styles.tabContainer}>
                        <div className={styles.tabImg}>

                        </div>
                        <div className={styles.tabText}>
                            <div>
                                <Typography variant="h5" align="center">
                                    {tabsContent[index].header}
                                </Typography>
                            </div>
                            <hr/>
                            <div>
                                <Typography variant="body1" align="justify">
                                    {tabsContent[index].text}
                                </Typography>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

    return (
        <div className={styles.contents}>
            <div className={styles.tabs}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Connect with BGG"/>
                    <Tab label="Rank Games" />
                    <Tab label="Playroom" />
                    <Tab label="Best game for You" />
                </Tabs>
            </div>
            <div className={styles.tabContent}>
                <CustomTabPanel index={0}/>
                <CustomTabPanel index={1}/>
                <CustomTabPanel index={2}/>
                <CustomTabPanel index={3}/>
            </div>
        </div>
    )
}

export default CapabilitiesSlider;
