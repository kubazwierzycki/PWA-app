import {ChangeEvent, ReactNode, useState} from "react";
import styles from "../../styles/createPlayroom.module.css";
import {Button, Card, Checkbox, FormControlLabel, FormGroup, Input, Typography} from "@mui/material";
import {Link} from "react-router-dom";

/**
 * Live board game playing room joining page
 * @returns {ReactNode}
 */
const PlayroomJoin = (): ReactNode => {

    // playroom code entered by user
    const [code, setCode] = useState<string>("");

    // entered nick value for playroom
    const [nick, setNick] = useState<string>("");

    // should username be used as nick
    const [useUsername, setUseUsername] = useState<boolean>(true);

    const handleCodeInputChange = (
        inputVal: ChangeEvent<HTMLInputElement>
    ) => setCode(inputVal.target.value);

    const handleNickInputChange = (
        inputVal: ChangeEvent<HTMLInputElement>
    ) => setNick(inputVal.target.value);

    const handleCheckboxChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => setUseUsername(event.target.checked);

    return (
        <div className={styles.container}>
            <Card className={styles.generateBox} sx={{borderRadius: "20px"}}>
                <Typography>
                    Please fill in the playroom code
                </Typography>
                <Input
                    disabled={false}
                    value={code}
                    size="medium"
                    style={{width: "80%", marginBottom: "10px"}}
                    onChange={handleCodeInputChange}
                    placeholder="Playroom code"
                />
                <div style={{width: "80%", textAlign: "center"}}>
                    <Typography>
                        Enter your desired playroom nick:
                    </Typography>
                    <div className={styles.nickInput}>
                        <Input
                            disabled={false}
                            value={nick}
                            size="medium"
                            style={{width: "100%", marginBottom: "10px"}}
                            onChange={handleNickInputChange}
                            placeholder="Your nick"
                        />
                        <FormGroup>
                            <FormControlLabel
                                label="Use my username"
                                control={
                                    <Checkbox
                                        defaultChecked
                                        value={useUsername}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                            />
                        </FormGroup>
                    </div>
                </div>
                <Button variant="contained" sx={{marginTop: "10px"}}>
                    Join playroom
                </Button>
                <br/>
                <hr style={{width: "80%"}}/>
                <Typography>
                    Don't have a code? You can create a playroom&nbsp;
                    <Link to={"/play/create"}>
                        here
                    </Link>
                </Typography>
            </Card>
        </div>
    )
}

export default PlayroomJoin;
