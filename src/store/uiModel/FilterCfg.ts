import { observable, computed } from "mobx";

export class FilterCfg {
    @observable sortBy: "creat_time" | "update_time" | "dictionary_order" = "dictionary_order";
    @observable sortOrd: "asd" | "des" = "asd";
    @observable fiterBy: "language" | "tag" | "none" = "none";
    @observable fiterPayload: string | null = null;
    @observable selectStarred = false;
    @observable access: "all" | "public" | "private" = "all";
    @observable sreach: string|null = null;
}