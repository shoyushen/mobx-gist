import React from 'react';
import { Item } from "./ElementItem";
import { ListItemIcon, ListItem, ListItemText, Box } from "@material-ui/core";
import { yellow } from '@material-ui/core/colors';
import StarIcon from '@material-ui/icons/Star';
import { observer } from "mobx-react-lite";
import { Link } from 'react-router-dom';

type I = Item & { isStarred: boolean };
type P = { item: I; onClick: (key: string) => void };
export const ItemWithStar = observer(({ item, onClick }: P) => (
    <ListItem
        button
        selected={item.isSelected}
        onClick={() => {
            onClick(item.key);
        }}
        component={Link} to={`/home/${item.key}`}
    >
        <ListItemText primary={item.text} />
        {!item.isStarred ? null : <ListItemIcon><StarIcon style={{ color: yellow[700] }} /></ListItemIcon>}
    </ListItem>
));