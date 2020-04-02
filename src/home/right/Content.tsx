import React from "react";
import { Gist } from "../../store/uiModel/Gists";
import { Box, Chip, Typography, Divider, makeStyles } from '@material-ui/core';
import { ExpandCode } from "./ExpandCode";

const useStyle = makeStyles({
    sc: {
        overflow: "auto"
    }
})

export function Content({ gist }: { gist: Gist }) {
    let style = useStyle();
    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" className={style.sc}>
            <Box ml={1}>
                <Typography variant="h4">{gist.gist.name}</Typography>
            </Box>
            <Box ml={1}>
                <Typography>{gist.gist.description}</Typography>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="space-between" ml={1} mb={1}>
                <Box flexGrow={6}>{Array.from(gist.gist.tags.keys()).map(t => <Chip key={t} size="small" label={t} style={{ marginRight: "3px", marginBottom: "3px" }} />)}</Box>
                <Box flexGrow={1}>{gist.gist.updatedAt.toString()}</Box>
            </Box>
            <Divider></Divider>
            <Box flexGrow={1}>
                {
                    Array.from(gist.gist.files.values()).map(f => <Box key={f.fileName} mb="2px">
                        <ExpandCode f={f}></ExpandCode>
                    </Box>)
                }
            </Box>
        </Box>
    );
}