import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
    <LinearProgress
        variant="determinate"
    value={progress}
    sx={{ width: '100%', mb: 1 }}
    />
    <Typography variant="body2" color="textSecondary">
        {`Loading: ${progress}%`}
    </Typography>
    </Box>
);
};

export default ProgressBar;
