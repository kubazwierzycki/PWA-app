import {ReactNode} from "react";
import CollectionToggle from "../../components/CollectionToggle.tsx";
import styles from "../../styles/collections.module.css"
import BoardGameTile from "../../components/BoardGameTile.tsx";
import {Pagination} from "@mui/material";

/**
 * User game board collection page
 * @returns {ReactNode}
 */
const CollectionPage = (): ReactNode => {



    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <CollectionToggle />
            </div>
            <div className={styles.body}>
                <BoardGameTile />
                <BoardGameTile />
                <BoardGameTile />
                <BoardGameTile />
            </div>
            <div className={styles.pagination}>
                <Pagination count={10} shape="rounded" />
            </div>
        </div>
    )
}

export default CollectionPage;
