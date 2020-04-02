import React, { useCallback } from "react";
import { Gist } from "../../store/uiModel/Gists";
import { Dialog, IconButton, ButtonGroup, Typography, Box, Divider, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CreateIcon from '@material-ui/icons/Create';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DeleteIcon from '@material-ui/icons/Delete';
import { yellow } from '@material-ui/core/colors';
import { Content } from "./Content";
import { useObserver, useLocalStore } from "mobx-react-lite";

type P = { gist: Gist, openWind: (k: string) => void, deletes: (k: string) => void }

export function Browse({ gist, openWind, deletes }: P) {
    const ls = useLocalStore(() => ({
        isOpened: false,
    }));
    const del = useCallback(() => {
        ls.isOpened = !ls.isOpened;
        deletes(gist.gist.id);
    }, []);
    const close = useCallback(() => {
        ls.isOpened = !ls.isOpened;
    }, []);
    const star = useCallback(() => {
        if (gist.gist.isStarred) {
            gist.gist.unstar();
        } else {
            gist.gist.star();
        }
    }, [])
    return useObserver(() => <Box width="100%" height="100vh" display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Box mt="10px" ml="10px">
                <Typography variant="h6">
                    {gist.gist.isPublic ? 'Public' : 'Private'} Gist
                </Typography>
            </Box>
            <Box>
                <ButtonGroup>
                    <IconButton onClick={star}>
                        {gist.gist.isStarred ? <StarIcon style={{ color: yellow[700] }}></StarIcon> : <StarBorderIcon></StarBorderIcon>}
                    </IconButton>
                    <IconButton onClick={() => { openWind(gist.gist.id) }}>
                        <OpenInNewIcon></OpenInNewIcon>
                    </IconButton>
                    <IconButton onClick={close}>
                        <DeleteIcon></DeleteIcon>
                    </IconButton>
                    <Dialog open={ls.isOpened} onClose={close}>
                        <DialogTitle>Are you sure to delete this gist?</DialogTitle>
                        <DialogContent>
                            <DialogContentText>This operation can not drawback!</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={del} color="primary">Delete</Button>
                            <Button onClick={close} color="primary" autoFocus>Give up</Button>
                        </DialogActions>
                    </Dialog>
                </ButtonGroup>
            </Box>
        </Box>
        <Divider></Divider>
        <Content gist={gist}></Content>
    </Box>);
}