import React from "react";
import { Box, Fab, Typography, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';

export function Default() {
    return <>
        <Box mt={1} mb={1} ml={1}>
            <Typography>
                Browse a gist by clicking the gist's name!
            </Typography>
        </Box>
    </>
}