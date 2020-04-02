import { observable, computed, autorun, IObservableValue, action, when } from "mobx";
import { createTransformer } from "mobx-utils";
import { FilterCfg } from "./FilterCfg";
import { Gists as DomainGists } from "../domainModel/Gists";
import { Gist as DomainGist } from "../domainModel/Gist";
import { UpdateGist } from "../domainModel/Update";
import { AddGist } from "../domainModel/Add";

export class Gist {
    constructor(
        public gist: DomainGist,
        private cfg: FilterCfg,
        private selectedId: IObservableValue<string> | null,
    ) {
        when(() => this.isSelected, () => {
            this.gist.loadFile();
        });
    }
    @computed
    get isFiltered() {
        switch (this.cfg.fiterBy) {
            case "language":
                if (!this.gist.langs.has(this.cfg.fiterPayload!)) {
                    return true;
                }
                break;
            case "tag":
                if (!this.gist.tags.has(this.cfg.fiterPayload!)) {
                    return true;
                }
                break;
            default:
                break;
        }
        if (this.cfg.selectStarred && !this.gist.isStarred) {
            return true;
        }
        switch (this.cfg.access) {
            case "public":
                if (!this.gist.isPublic) {
                    return true;
                }
                break;
            case "private":
                if (this.gist.isPublic) {
                    return true;
                }
                break;
            default:
                break;
        }
        if (this.cfg.sreach !== null && !this.gist.name.includes(this.cfg.sreach)) {
            return true;
        }
        return false;
    }
    @computed
    get isSelected() {
        if (this.selectedId === null) {
            return false;
        } else if (this.selectedId.get() === this.gist.id) {
            return true;
        }
        return false;
    }
}

export class Gists {
    @observable selectedId: IObservableValue<string> | null = null;
    @observable gists: Gist[] = [];
    @observable inEdited = false;
    @observable curAdd = new AddGist();
    @observable curUpdate: UpdateGist | null = null;
    constructor(
        private dmGists: DomainGists,
        private cfg: FilterCfg
    ) {
        const gistT = createTransformer((g: DomainGist) => new Gist(g, this.cfg, this.selectedId));
        const sT = createTransformer((m: Map<string, DomainGist>) => Array.from(m.values()).map(gistT));
        autorun(() => {
            let helper = (ord: boolean) => (b: number) => ord ? b : -1 * b;
            let genSortF = (lens: (g: Gist) => any) => (ord: (b: number) => number) => {
                return (A: Gist, B: Gist) => ord(lens(A) > lens(B) ? 1 : -1);
            };
            let sortFunc;
            switch (this.cfg.sortBy) {
                case "creat_time":
                    sortFunc = genSortF(g => g.gist.createdAt);
                    break;
                case "update_time":
                    sortFunc = genSortF(g => g.gist.updatedAt);
                    break;
                default:
                    sortFunc = genSortF(g => g.gist.name);
                    break;
            }
            if (this.cfg.sortOrd === "asd") {
                sortFunc = sortFunc(helper(true));
            } else {
                sortFunc = sortFunc(helper(false));
            }
            this.gists = observable(sT(dmGists.gists).sort(sortFunc));
        })
        autorun(()=>{
            if (this.selectedId === null) {
                console.log("selectedId:null");
            } else {
                console.log("selectedId:",this.selectedId.get());
            }
        });
    }
    @action.bound
    setSelected(k: string | null) {
        if (this.selectedId === null && k !== null) {
            this.selectedId = observable.box(k);
        } else if (k === null) {
            this.selectedId = null;
        } else {
            this.selectedId?.set(k);
        }
    }
    @action
    loadUp(){
        if(this.selectedId!==null&&this.curUpdate===null){
            this.curUpdate=new UpdateGist(this.dmGists.gists.get(this.selectedId.get())!);
        }
    }
}