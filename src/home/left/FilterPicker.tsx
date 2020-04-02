import React, { useCallback, useRef } from 'react';
import { Input, IconButton, Box, Popper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SortIcon from '@material-ui/icons/Sort';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { FilterCfg } from '../../store/uiModel/FilterCfg';
import { FilterPaper } from './FilterPaper';

export function FilterPicker({ cfg }: { cfg: FilterCfg }) {
  const ls = useLocalStore(() => ({
    tempSearch: "",
    isOpened: false
  }))
  const setTempSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    ls.tempSearch = event.target.value;
  }, []);
  const popRef = useRef(null);
  const pop = useCallback(() => {
    ls.isOpened = !ls.isOpened;
  }, []);
  const onSearch = useCallback(() => {
    cfg.sreach = ls.tempSearch;
  }, []);
  return useObserver(() => (
    <Box display="flex" flexDirection="row" p="10px">
      <Box pt="5px">
        <IconButton onClick={pop} ref={popRef} size="small">
          <SortIcon />
        </IconButton>
        <Popper open={ls.isOpened} anchorEl={popRef.current}>
          <FilterPaper cfg={cfg} />
        </Popper>
      </Box>
      <Box>
        <Input placeholder="Sreach" value={ls.tempSearch} onChange={setTempSearch} />
      </Box>
      <Box pt="5px">
        <IconButton size="small" onClick={onSearch}>
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  ));
}