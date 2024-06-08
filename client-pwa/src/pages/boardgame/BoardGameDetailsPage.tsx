import {ReactNode} from "react";
import {useParams} from "react-router-dom";


const BoardGameDetailsPage = (): ReactNode => {

    const { gameId } = useParams<{ gameId: string }>();

    return (
        <div>
            {gameId}
        </div>
    )
}

export default BoardGameDetailsPage;
