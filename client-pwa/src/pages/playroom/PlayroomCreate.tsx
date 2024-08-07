import {ReactNode} from "react";
import CreatePlayroomStepper from "../../components/views/CreatePlayroomStepper.tsx";

/**
 * Live board game playing room creation page
 * @returns {ReactNode}
 */
const PlayroomCreate = (): ReactNode => {


    return (
        <div>
            <CreatePlayroomStepper />
        </div>
    )
}

export default PlayroomCreate;
