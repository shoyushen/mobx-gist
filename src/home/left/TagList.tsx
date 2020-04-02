import React, { useCallback } from 'react';
import { List, ListSubheader,Paper, makeStyles } from '@material-ui/core';
import { createTransformer } from 'mobx-utils';
import { observable, runInAction } from 'mobx';
import { FilterCfg } from '../../store/uiModel/FilterCfg';
import { ElementItem } from './ElementItem';
import { Tags, Tag } from '../../store/uiModel/Tags';
import { useObserver } from 'mobx-react-lite';

const useStyles = makeStyles({
    root: {
      backgroundColor: "white",
      width:"100%"
    }
  }
);

export function TagList({ tags, cfg }: { tags: Tags, cfg: FilterCfg }) {
    let style = useStyles();
    let trans = useCallback(createTransformer((t: Tag) => {
        return observable({
            get text() {
                return t.name;
            },
            get key() {
                return t.name;
            },
            get isSelected() {
                return t.isSelected;
            }
        });
    }), []);
    const onClick = useCallback((k: string) => {
        runInAction(() => {
            cfg.fiterBy = 'tag';
            cfg.fiterPayload = k;
        })
    }, []);
    return useObserver(()=><List component="nav" subheader={<ListSubheader className={style.root}>Tags</ListSubheader>}>
        {tags.tags.map(trans).map(i => <ElementItem key={i.key} item={i} onClick={onClick} />)}
    </List>);
}