import { observable, computed, autorun, reaction } from "mobx";
import { createTransformer } from "mobx-utils";
import { FilterCfg } from "./FilterCfg";
import { Gists } from "../domainModel/Gists";

export class Language {
    constructor(
        private cfg: FilterCfg,
        readonly name: string
    ) { }
    @computed
    get isSelected() {
        return this.cfg.fiterBy === "language" && this.cfg.fiterPayload === this.name;
    }
}

export class Langs {
    @observable langs: Language[]=[];
    constructor(
        private gists: Gists,
        private cfg: FilterCfg
    ) {
        const lanT = createTransformer((n:string)=>new Language(this.cfg,n));
        const sT = createTransformer((m:Map<string,number>)=>Array.from(m.keys()).map(lanT));
        autorun(()=>{
            this.langs=observable(sT(gists.languages));
        })
    }
}