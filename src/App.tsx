import React from "react";
import { Box, CssBaseline, Paper } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";

import { DomainStore } from "./store/DomainStore";
import { SignIn } from "./sign-in/SignIn";
import { Home } from "./home/Home";

function App() {
  return (<>
    <CssBaseline />
    <Box position="fixed" width="100%" height="100%" top="0" bottom="0" bgcolor={grey[400]}>
      <Box width="1280px" margin="0 auto" height="100vh">
        <DomainStore>
          <Router>
            <Switch>
              <Route path="/sign-in" component={SignIn} />
              <Route path="/home" component={Home} />
              <Route>
                <Redirect to="/sign-in" />
              </Route>
            </Switch>
          </Router>
        </DomainStore>
      </Box>
    </Box>
  </>
  );
}

export default App;
