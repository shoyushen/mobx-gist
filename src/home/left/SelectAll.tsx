import React, { useCallback } from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { runInAction } from 'mobx';
import { FilterCfg } from '../../store/uiModel/FilterCfg';
import { useObserver } from 'mobx-react-lite';

export function SelectAll({ cfg }: { cfg: FilterCfg }) {
    const onClick = useCallback(() => {
        runInAction(() => {
            cfg.fiterBy = 'none';
            cfg.fiterPayload = null;
        })
    }, []);
    return useObserver(() => <List component="nav">
        <ListItem button selected={cfg.fiterBy === "none"} onClick={onClick}>
            <ListItemText primary={"All"} />
        </ListItem>
    </List>);
}