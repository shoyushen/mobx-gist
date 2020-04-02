import { observable, computed, autorun, reaction } from "mobx";
import { createTransformer } from "mobx-utils";
import { FilterCfg } from "./FilterCfg";
import { Gists } from "../domainModel/Gists";

export class Tag {
    constructor(
        private cfg: FilterCfg,
        readonly name: string
    ) { }
    @computed
    get isSelected() {
        return this.cfg.fiterBy === "tag" && this.cfg.fiterPayload === this.name;
    }
}

export class Tags {
    @observable tags: Tag[]=[];
    constructor(
        private gists: Gists,
        private cfg: FilterCfg
    ) {
        const tagT = createTransformer((n:string)=>new Tag(this.cfg,n));
        const sT = createTransformer((m:Map<string,number>)=>Array.from(m.keys()).map(tagT));
        autorun(()=>{
            this.tags=observable(sT(gists.tags));
        })
    }
}