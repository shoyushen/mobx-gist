import React, { useCallback } from 'react';
import { List } from '@material-ui/core';
import { useObserver } from 'mobx-react-lite';
import { Gists, Gist } from '../../store/uiModel/Gists';
import { createTransformer } from 'mobx-utils';
import { observable } from 'mobx';
import { ItemWithStar } from './ItemWithStar';

export function GistNameList({ gists }: { gists: Gists }) {
    let trans = useCallback(createTransformer((g: Gist) => {
        return observable({
            get text() {
                return g.gist.name;
            },
            get key() {
                return g.gist.id;
            },
            get isSelected() {
                return g.isSelected;
            },
            get isStarred(){
                return g.gist.isStarred;
            }
        });
    }), []);
    return useObserver(() => {
        return (
            <List component="nav">
                {gists.gists.filter(g => !g.isFiltered).map(trans).map(i => <ItemWithStar key={i.key} item={i} onClick={gists.setSelected} />)}
            </List>
        );
    });
}