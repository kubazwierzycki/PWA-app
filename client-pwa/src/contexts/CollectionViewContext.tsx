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
    setOrdering: Dispatch<SetStateAction<string>>
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

    return (
        <CollectionViewContext.Provider value={{
            type,
            setType,
            ordering,
            setOrdering
        }}>
            {children}
        </CollectionViewContext.Provider>
    )
}

export const useCollectionViewContext = () => {
    return useContext(CollectionViewContext);
};
