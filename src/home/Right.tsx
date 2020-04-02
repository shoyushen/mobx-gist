import React, { useCallback } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { useDomainStore } from "../store/DomainStore";
import { useUiStore } from "../store/UiStore";
import { Browse } from "./right/Browse";
import { Load } from "./Load";
import { Box } from "@material-ui/core";
import { AddGist } from "../store/domainModel/Add";

export function Right() {
    let { gists, auth } = useDomainStore();
    let { gists: uiGists } = useUiStore();
    let { id } = useParams();
    useLocalStore(() => ({
        isEdit: false
    }));
    const openW = useCallback((k: string) => {
        window.open(`https://gist.github.com/${auth.user?.login}/${k}`);
    }, []);
    const del = useCallback((k: string) => {
        gists.deleteGist(k);
    }, []);
    const edit = useCallback(() => {
        uiGists.inEdited = true;
    }, []);
    return useObserver(() => {
        let gist = uiGists.gists.find(g => g.gist.id === id);
        if (gist === undefined) {
            return <Redirect to="/home" />;
        } else if (!gist.gist.isFilesLoaded) {
            return (
                <Box height="100vh">
                    <Load></Load>
                </Box>
            );
        } else {
            return <Browse gist={gist} openWind={openW} deletes={del} />;
        }
    });
}
