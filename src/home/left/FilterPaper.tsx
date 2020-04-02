import React, { useCallback, forwardRef } from 'react';
import { FilterCfg } from "../../store/uiModel/FilterCfg";
import { Paper, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, ClickAwayListener, Box } from '@material-ui/core';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { runInAction } from 'mobx';

function canFilp(pri: boolean, pub: boolean) {
    if (!pri && !pub) {
        return false;
    }
    return true;
}

export const FilterPaper = ({ cfg }: { cfg: FilterCfg }) => {
    const ls = useLocalStore(() => ({
        get private() {
            return cfg.access != "public";
        },
        get public() {
            return cfg.access != 'private';
        }
    }))
    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        let opPri = ls.private, opPub = ls.public;
        switch (event.target.name) {
            case 'private':
                opPri = !opPri;
                break;
            case 'public':
                opPub = !opPub;
                break;
            case 'starred':
                cfg.selectStarred = !cfg.selectStarred;
        }
        if (canFilp(opPri, opPub)) {
            runInAction(() => {
                if (opPri && opPub) {
                    cfg.access = 'all';
                } else if (opPri) {
                    cfg.access = 'private';
                } else {
                    cfg.access = 'public';
                }
            });
        }
    }, []);
    const onSortChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        cfg.sortBy = event.target.value as any;
    }, []);
    const onOrdChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        cfg.sortOrd = event.target.value as any;
    }, []);
    return useObserver(() => (
        <Paper>
            <Box display="flex" flexDirection="column" p="10px">
                <Box display="flex" flexDirection="row">
                    <FormControlLabel
                        control={<Checkbox checked={ls.private} onChange={onChange} name="private" />}
                        label="Private"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={ls.public} onChange={onChange} name="public" />}
                        label="Public"
                    />
                </Box>
                <FormControlLabel
                    control={<Checkbox checked={cfg.selectStarred} onChange={onChange} name="starred" />}
                    label="Starred"
                />
                <InputLabel id="sort-by-lable">Sort By</InputLabel>
                <Select
                    labelId="sort-by-lable"
                    id="sort-by"
                    value={cfg.sortBy}
                    onChange={onSortChange}
                >
                    <MenuItem value="creat_time">Create Time</MenuItem>
                    <MenuItem value="update_time">Update Time</MenuItem>
                    <MenuItem value="dictionary_order">Dictionary Order</MenuItem>
                </Select>
                <InputLabel id="sort-ord-lable">Order</InputLabel>
                <Select
                    labelId="sort-ord-lable"
                    id="sort-ord"
                    value={cfg.sortOrd}
                    onChange={onOrdChange}
                >
                    <MenuItem value="asd">Ascend</MenuItem>
                    <MenuItem value="des">Descend</MenuItem>
                </Select>
            </Box>
        </Paper>
    ))
}