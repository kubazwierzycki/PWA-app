import {Button} from "@mui/material";


const MenuButton = ({text, onClick}: {text: string, onClick?: () => void | undefined}) => {


    return (
        <div>
            <Button onClick={onClick}>
                {text}
            </Button>
        </div>
    )
}

export default MenuButton;