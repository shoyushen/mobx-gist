import React, { useCallback } from 'react';
import { List, ListSubheader,makeStyles} from '@material-ui/core';
import { Langs, Language } from '../../store/uiModel/Langs';
import { createTransformer } from 'mobx-utils';
import { observable, runInAction } from 'mobx';
import { FilterCfg } from '../../store/uiModel/FilterCfg';
import { ElementItem } from './ElementItem';
import { useObserver } from 'mobx-react-lite';

const useStyles = makeStyles({
    root: {
      backgroundColor: "white",
      width:"100%"
    }
  }
);


export function LanList({ lans, cfg }: { lans: Langs, cfg: FilterCfg }) {
    const style = useStyles();
    let trans = useCallback(createTransformer((l: Language) => {
        return observable({
            get text() {
                return l.name;
            },
            get key() {
                return l.name;
            },
            get isSelected() {
                return l.isSelected;
            }
        });
    }), []);
    const onClick = useCallback((k: string) => {
        runInAction(() => {
            cfg.fiterBy = 'language';
            cfg.fiterPayload = k;
        })
    }, []);
    return useObserver(() => <List component="nav" subheader={<ListSubheader className={style.root}>Languages</ListSubheader>}>
        {lans.langs.map(trans).map(i => <ElementItem key={i.key} item={i} onClick={onClick} />)}
    </List>);
}
