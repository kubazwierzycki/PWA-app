import {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";

type CollectionContextType = {
    type: string,
    setType: Dispatch<SetStateAction<string>>,
    ordering: string,
    setOrdering: Dispatch<SetStateAction<string>>,
    filtersOpen: boolean,
    setFiltersOpen: Dispatch<SetStateAction<boolean>>,
    filtersAnchorEl: HTMLElement | null,
    setFiltersAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
}

const CollectionViewContext = createContext<CollectionContextType>({} as CollectionContextType);

/**
 * Context controlling state of collection page view toggles
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const CollectionContextProvider = ({children}: {children: ReactElement}): ReactNode => {

    const [type, setType] = useState('owned');
    const [ordering, setOrdering] = useState('ranking');

    // filters popover
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filtersAnchorEl, setFiltersAnchorEl] = useState<HTMLElement | null>(null);

    return (
        <CollectionViewContext.Provider value={{
            type,
            setType,
            ordering,
            setOrdering,
            filtersOpen,
            setFiltersOpen,
            filtersAnchorEl,
            setFiltersAnchorEl
        }}>
            {children}
        </CollectionViewContext.Provider>
    )
}

export const useCollectionViewContext = () => {
    return useContext(CollectionViewContext);
};
