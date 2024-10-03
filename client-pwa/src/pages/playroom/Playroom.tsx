import { Button } from "@mui/material";
import {ReactNode, useEffect} from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { buildStartGameMessage, PlayroomMessage } from "../../services/playroom";
import { usePlayroomContext } from "../../contexts/PlayroomContext";

/**
 * Playroom
 * @returns {ReactNode}
 */
const Playroom = (): ReactNode => {

    const { sendJsonMessage, lastJsonMessage} = useWebSocketContext();
    const {code} = usePlayroomContext();

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            const messageType : string = (lastJsonMessage as PlayroomMessage).type;
            switch(messageType){
                case "waitingRoom": {
                    console.log("waitingRoom");
                    break;
                }
                case "playroom": {
                    console.log("playroom");
                    break;
                }
                default: {
                    console.log("Unknown message type");
                    break;
                }
            }
        } else {
            console.log("None");
        }
    }, [lastJsonMessage]);

    const handleStartGame = () => {
        console.log("Start");
        sendJsonMessage(buildStartGameMessage(code));
    }

    return (
        <div>
            Playroom
            <Button>End</Button>
            <Button onClick={handleStartGame}>Start</Button>
            <Button>Pause</Button>
        </div>
    )
}

export default Playroom;
