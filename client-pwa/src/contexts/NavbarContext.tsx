import React, {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";

type NavbarContextType = {
    drawerOpen: boolean;
    setDrawerOpen: Dispatch<SetStateAction<boolean>>;
    userPopupOpen: boolean;
    setUserPopupOpen: Dispatch<SetStateAction<boolean>>;
    anchorEl: HTMLButtonElement | null;
    setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
    handlePopoverClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handlePopoverClose: () => void;
}

const NavbarContext = createContext<NavbarContextType>({} as NavbarContextType);

/**
 * Context providing main navbar state
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const NavContextProvider = ({children}: {children: ReactElement}): ReactNode => {

    // state controlling drawer menu visibility
    const [drawerOpen, setDrawerOpen] = useState(false);

    // state controlling user interface popup visibility
    const [userPopupOpen, setUserPopupOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setUserPopupOpen(false);
        setAnchorEl(null);
    }

    return (
        <NavbarContext.Provider value={{
            drawerOpen,
            setDrawerOpen,
            userPopupOpen,
            setUserPopupOpen,
            anchorEl,
            setAnchorEl,
            handlePopoverClick,
            handlePopoverClose
        }}>
            {children}
        </NavbarContext.Provider>
    )
}

export const useNavContext = () => {
    return useContext(NavbarContext);
};
