import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { observer } from "mobx-react-lite";

export type Item = { text: string; isSelected: boolean; key: string };
type P = { item: Item; onClick: (key: string) => void };
export const ElementItem = observer(({ item, onClick }: P) => (
  <ListItem
    button
    selected={item.isSelected}
    onClick={() => {
      onClick(item.key);
    }}
  >
    <ListItemText primary={item.text} />
  </ListItem>
));
