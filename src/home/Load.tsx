import React from "react";
import { makeStyles, CircularProgress } from "@material-ui/core";

const useStyle = makeStyles({
  mid: {
    position: "relative",
    left: "50%",
    top: "50%"
  }
});

export function Load() {
  const style = useStyle();
  return <CircularProgress className={style.mid} />;
}
