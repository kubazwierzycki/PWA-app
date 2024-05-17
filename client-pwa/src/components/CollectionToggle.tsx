import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
    toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import styles from '../styles/collections.module.css'
import {useState} from "react";
import NumbersIcon from '@mui/icons-material/Numbers';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import {Button} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
        margin: theme.spacing(0.5),
        border: 0,
        borderRadius: theme.shape.borderRadius,
        [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0,
        },
    },
    [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
        {
            marginLeft: -1,
            borderLeft: '1px solid transparent',
        },
}));

const CollectionToggle = () => {

    const [type, setType] = useState('owned');
    const [ordering, setOrdering] = useState('ranking');

    const handleType = (
        _event: React.MouseEvent<HTMLElement>,
        newType: string
    ) => {
        setType(newType);
    };

    const handleOrdering = (
        _event: React.MouseEvent<HTMLElement>,
        newOrdering: string
    ) => {
        setOrdering(newOrdering);
    }

    return (
        <div className={styles.collectionsToggle}>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
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
                <Button style={{textTransform:"none"}}>
                    <FilterAltIcon />
                    Filter
                </Button>
                <Button style={{textTransform:"none"}}>
                    Update ranking
                    <ArrowRightIcon />
                </Button>
            </Paper>
        </div>
    );
}

export default CollectionToggle;
