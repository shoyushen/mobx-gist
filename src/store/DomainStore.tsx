import React, { useContext, createContext } from "react";
import { Auth } from "./domainModel/Auth";
import { Gists } from "./domainModel/Gists";
import { useLocalStore } from "mobx-react-lite";

type St = { auth: Auth; gists: Gists };
const Ctx = createContext<St | null>(null);

export function DomainStore({ children }: { children: JSX.Element | JSX.Element[] }) {
  const st = useLocalStore(() => {
    const auth = new Auth();
    const gists = new Gists(auth);
    const st = { auth, gists };
    return st;
  });
  return <Ctx.Provider value={st}>{children}</Ctx.Provider>;
}

export const useDomainStore = () => {
  const st = useContext(Ctx);
  if (st === null) {
    throw new Error("never gonna be happen!");
  }
  return st;
};
