import React from "react";
import { Grid, Divider, Paper, Box, makeStyles } from "@material-ui/core";
import { UserShow } from "./left/UserShow";
import { LanList } from "./left/LanList";
import { TagList } from "./left/TagList";
import { GistNameList } from "./left/GistNameList";
import { FilterPicker } from "./left/FilterPicker";
import { useObserver } from "mobx-react-lite";
import { useUiStore } from "../store/UiStore";
import { useDomainStore } from "../store/DomainStore";
import { SelectAll } from "./left/SelectAll";

const useStyle = makeStyles({
  sc: {
    overflow: "auto"
  }
})


export function Left() {
  const style = useStyle();
  const { auth } = useDomainStore()
  const { fCfg, gists, langs, tags } = useUiStore();
  return useObserver(() => (
    <Box display="flex" flexDirection="row" height="100vh">
      <Box width="200px" display="flex" flexDirection="column">
        <UserShow userName={auth.user!.login} avatarUrl={auth.user!.avatarUrl} logout={auth.logout} />
        <Divider />
        <SelectAll cfg={fCfg} />
        <Divider />
        <Box minHeight="30%" flexGrow={1} className={style.sc}>
          <LanList lans={langs} cfg={fCfg} />
        </Box>
        <Divider />
        <Box minHeight="30%" flexGrow={1} className={style.sc}>
          <TagList tags={tags} cfg={fCfg} />
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box width="270px" display="flex" flexDirection="column">
        <FilterPicker cfg={fCfg} />
        <Divider />
        <Box flexGrow={1} className={style.sc}>
          <GistNameList gists={gists} />
        </Box>
      </Box>
    </Box>
  ));
}
