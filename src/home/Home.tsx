import React from "react";
import { Redirect, Route, useRouteMatch, Switch } from "react-router-dom";
import { useObserver } from "mobx-react-lite";
import { Load } from "./Load";
import { Left } from "./Left";
import { UiStore } from "../store/UiStore";
import { useDomainStore } from "../store/DomainStore";
import { Right } from "./Right";
import { Grid, makeStyles, Box, Paper, Divider } from "@material-ui/core";
import { Default } from "./right/Default";

const useStyle = makeStyles({
  rl:{
    position: 'relative',
  },
  ab: {
    position: 'absolute',
    bottom: "50px",
    right: "50px"
  }
})


export function Home() {
  let style = useStyle();
  const { auth, gists } = useDomainStore();
  let match = useRouteMatch();
  return useObserver(() => {
    if (!auth.isAuthed) {
      return <Redirect to="/sign-in" />;
    }
    if (!gists.isLoaded) {
      return <Load />;
    }
    return <UiStore>
      <Paper>
        <Box display="flex" flexDirection="row" height="100vh">
          <Box>
            <Left />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box flexGrow={1} height="100vh">
            <Switch>
              <Route path={`${match.path}/:id`} component={Right} />
              <Route component={Default} />
            </Switch>
          </Box>
        </Box>
      </Paper>
    </UiStore>;
  });
}
