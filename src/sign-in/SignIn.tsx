import React from "react";
import { Redirect } from "react-router-dom";
import {
  Typography,
  Paper,
  Button,
  makeStyles,
  Divider,
  Link
} from "@material-ui/core";
import { useDomainStore } from "../store/DomainStore";
import { useObserver } from "mobx-react-lite";
import logo from '../resource/GitHub-Mark-120px-plus.png';

const useStyle = makeStyles({
  block: {
    display: "block",
    margin: "0 auto",
    marginBottom: "20px",
    marginTop: "20px"
  },
  typo: {
    margin: "20px 10px 15px"
  },
  mid: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    width: "300px"
  }
});

export function SignIn() {
  const { auth } = useDomainStore();
  const style = useStyle();
  return useObserver(() => {
    if (auth.isAuthed) {
      return <Redirect to="/home" />;
    }
    return (
      <Paper className={style.mid}>
        <Typography className={style.typo} variant="h6">
          Login
        </Typography>
        <Divider />
        <img src={logo} className={style.block} />
        <Button
          onClick={auth.login}
          variant="contained"
          color="primary"
          className={style.block}
        >
          login with github
        </Button>
        <Link className={style.block} color="inherit" align="center">
          star this project!
        </Link>
      </Paper>
    );
  });
}
