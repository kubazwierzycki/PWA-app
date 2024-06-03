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
    setFiltersAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>,
    filtersState: FiltersState,
    setFiltersState: Dispatch<SetStateAction<FiltersState>>,
    minRating: number,
    setMinRating: Dispatch<SetStateAction<number>>
}

interface FiltersState {
    rated: boolean;
    commented: boolean;
    minRating: boolean;
}

export const CollectionViewContext = createContext<CollectionContextType>({} as CollectionContextType);

/**
 * Context controlling state of collection page view toggles and filters
 * Controls type of collection, ordering and filters for {@link CollectionPage},
 * {@link CollectionToggle}, {@link FiltersPicker}
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const CollectionContextProvider = ({children}: {children: ReactElement}): ReactNode => {

    const [type, setType] = useState('owned');
    const [ordering, setOrdering] = useState('ranking');

    // filters popover
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filtersAnchorEl, setFiltersAnchorEl] = useState<HTMLElement | null>(null);

    // filters state
    const [filtersState, setFiltersState] = useState<FiltersState>({
        rated: false,
        commented: false,
        minRating: false,
    });
    const [minRating, setMinRating] = useState(5);

    return (
        <CollectionViewContext.Provider value={{
            type,
            setType,
            ordering,
            setOrdering,
            filtersOpen,
            setFiltersOpen,
            filtersAnchorEl,
            setFiltersAnchorEl,
            filtersState,
            setFiltersState,
            minRating,
            setMinRating
        }}>
            {children}
        </CollectionViewContext.Provider>
    )
}

export const useCollectionViewContext = () => {
    return useContext(CollectionViewContext);
};
