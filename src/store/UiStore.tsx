import React, { useContext, createContext } from "react";
import { useLocalStore } from "mobx-react-lite";
import { FilterCfg } from "./uiModel/FilterCfg";
import { Gists } from "./uiModel/Gists";
import { Langs } from "./uiModel/Langs";
import { Tags } from "./uiModel/Tags";
import { useDomainStore } from "./DomainStore";

type St = { fCfg: FilterCfg, gists: Gists, langs: Langs, tags: Tags };
const Ctx = createContext<St | null>(null);

export function UiStore({ children }: { children: JSX.Element | JSX.Element[] }) {
    const { gists: dmGists } = useDomainStore();
    const st = useLocalStore(() => {
        const fCfg = new FilterCfg();
        const gists = new Gists(dmGists, fCfg);
        const langs = new Langs(dmGists, fCfg);
        const tags = new Tags(dmGists, fCfg);
        return { fCfg, gists, langs, tags };
    });
    return <Ctx.Provider value={st}>{children}</Ctx.Provider>;
}

export const useUiStore = () => {
    const st = useContext(Ctx);
    if (st === null) {
        throw new Error("never gonna be happen!");
    }
    return st;
};
