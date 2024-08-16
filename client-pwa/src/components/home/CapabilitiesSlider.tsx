import styles from "../../styles/home.module.css"
import {Tab, Tabs} from "@mui/material";
import {SyntheticEvent, useState} from "react";


const CapabilitiesSlider = () => {

    const [value, setValue] = useState(0);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
                    <div>
                        {index}
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
                    <Tab label="Connect with BGG" />
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
