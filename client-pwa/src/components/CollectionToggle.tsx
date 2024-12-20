import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import styles from '../styles/collections.module.css'
import NumbersIcon from '@mui/icons-material/Numbers';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import {Button} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {useCollectionViewContext} from "../contexts/CollectionViewContext.tsx";
import FiltersPicker from "./forms/FiltersPicker.tsx";
import {ReactNode} from "react";
import {Link} from "react-router-dom";
import StyledToggleButtonGroup from './controls/StyledToggleButtonGroup.tsx';


/**
 * Collection view control component for {@link CollectionPage}
 * Uses {@link CollectionViewContext} that controls state
 * @returns ReactNode
 */
const CollectionToggle = (): ReactNode => {

    const {
        type,
        setType,
        ordering,
        setOrdering,
        filtersOpen,
        setFiltersOpen,
        filtersAnchorEl,
        setFiltersAnchorEl,
        setLoading
    } = useCollectionViewContext();

    const handleType = (
        _event: React.MouseEvent<HTMLElement>,
        newType: string
    ) => {
        setType(newType);
        setLoading(true);
    };

    const handleOrdering = (
        _event: React.MouseEvent<HTMLElement>,
        newOrdering: string
    ) => {
        setOrdering(newOrdering);
        setLoading(true);
    }

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setFiltersOpen(!filtersOpen)
        setFiltersAnchorEl(event.currentTarget);
    }

    return (
        <div className={styles.collectionsToggle}>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}
            >
                <StyledToggleButtonGroup
                    size="small"
                    value={type}
                    exclusive
                    onChange={handleType}
                    aria-label="possesion-state"
                >
                    <ToggleButton value="owned" aria-label="owned">
                        OWNED
                    </ToggleButton>
                    <ToggleButton value="played" aria-label="played">
                        PLAYED
                    </ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <StyledToggleButtonGroup
                    size="small"
                    value={ordering}
                    exclusive
                    onChange={handleOrdering}
                    aria-label="ordering-state"
                >
                    <ToggleButton value="ranking" aria-label="ranking">
                        <NumbersIcon />
                        By ranking
                    </ToggleButton>
                    <ToggleButton value="alphabetical" aria-label="alphabetical">
                        <SortByAlphaIcon />
                        Alphabetical
                    </ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <Button style={{textTransform:"none"}} onClick={handleFilterClick}>
                    <FilterAltIcon />
                        Filter
                    <FiltersPicker anchorEl={filtersAnchorEl} />
                </Button>
                <Link to="/boardgames/compare">
                    <Button style={{textTransform:"none"}}>
                        Update ranking
                        <ArrowRightIcon />
                    </Button>
                </Link>
            </Paper>
        </div>
    );
}

export default CollectionToggle;
