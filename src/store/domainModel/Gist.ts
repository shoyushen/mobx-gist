import { observable, computed, runInAction } from "mobx";
import { CodeFile, FileJson } from "./CodeFile";
import axios from "axios";
import { UpdateGist } from "./Update";
import { Auth } from "./Auth";
import { addByKey, diffSet } from "../Helper";

type F = (
  tagsDiff: Map<string, number>,
  langsDiff: Map<string, number>
) => void;

export interface GistJson {
  url: string;
  id: string;
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  files: Record<string, FileJson>;
}

export class Gist {
  @observable files = new Map<string, CodeFile>();
  @observable.ref updatedAt: Date;
  @observable private _description: string;
  @observable isStarred: boolean;
  @observable isFilesLoaded = false;
  @observable langs = new Map<string,number>();

  constructor(
    readonly id: string,
    _description: string,
    isStarred: boolean,
    readonly isPublic: boolean,
    readonly createdAt: Date,
    updatedAt: Date,
    files: CodeFile[],
    private _auth: Auth,
    private _modifyCout: F
  ) {
    this._description = _description;
    this.isStarred = isStarred;
    this.updatedAt = updatedAt;
    files.forEach(f => {
      this.files.set(f.fileName, f);
      addByKey(this.langs,f.language,1);
    });
  }
  @computed
  get name() {
    const reg = /^\[(.*)\]/;
    if(this._description.match(reg)===null){
      return `Unnamed Gist`
    }
    return this._description.match(reg)![1];
  }
  @computed
  get tags() {
    const reg = / #([a-zA-Z]*)\b/;
    let set = new Set<string>();
    let match = this._description.match(reg);
    if(match===null){
      return set;
    }
    
    for(const [idx,tag] of match.entries()){
      if(idx!==0){
        set.add(tag);
      }
    }
    return set;
  }
  @computed
  get description() {
    return this._description;
  }
  async loadFile() {
    if (this.isFilesLoaded) {
      return;
    }
    let resp = await axios({
      ...this._auth.axiosCfg(`/gists/${this.id}`, "get")
    });
    runInAction(() => {
      let fjs = Object.values((resp.data as GistJson).files);
      fjs.forEach(fj => {
        this.files.get(fj.filename)!.update(fj);
      });
      this.isFilesLoaded = true;
    });
  }
  async star() {
    if (this.isStarred) {
      return;
    }
    await axios({
      ...this._auth.axiosCfg(`/gists/${this.id}/star`, "put")
    });
    runInAction(() => {
      this.isStarred = true;
    });
  }
  async unstar() {
    if (!this.isStarred) {
      return;
    }
    await axios({
      ...this._auth.axiosCfg(`/gists/${this.id}/star`, "delete")
    });
    runInAction(() => {
      this.isStarred = false;
    });
  }
  async update(up: UpdateGist): Promise<[boolean, string | null]> {
    let before=[this.tags,new Set(this.langs.keys())];
    const [flag, err] = up.check();
    if (!flag) {
      return [flag, err];
    }
    let gen = up.genUpdate();
    let resp = await axios({
      ...this._auth.axiosCfg(`/gists/${this.id}`, "patch"),
      data: gen
    });
    runInAction(() => {
      if (gen.description !== undefined) {
        this._description = gen.description;
      }
      let fjs = Object.values((resp.data as GistJson).files);
      for (const [oldName, newFile] of Object.entries(gen.files)) {
        if (this.files.has(oldName) && newFile !== null) {//modify file
          if (newFile.filename === undefined) {//just change content
            let newFjs = fjs.find(f => f.filename === oldName)!;
            let oldF = this.files.get(oldName)!;
            addByKey(this.langs,oldF.language,-1);
            addByKey(this.langs,newFjs.language,1);
            oldF.update(newFjs);
          } else {//change file name
            let newFjs = fjs.find(f => f.filename === newFile.filename)!;
            let oldF = this.files.get(oldName)!;
            addByKey(this.langs,oldF.language,-1);
            addByKey(this.langs,newFjs.language,1);
            this.files.delete(oldName);
            this.files.set(newFile.filename, oldF);
            oldF.update(newFjs);
          }
        } else if (this.files.has(oldName) && newFile === null) {//delete file
          let oldF = this.files.get(oldName)!;
          addByKey(this.langs,oldF.language,-1);
          this.files.delete(oldName);
        } else {//add file
          let newFjs = fjs.find(f => f.filename === oldName)!;
          addByKey(this.langs,newFjs.language,1);
          this.files.set(oldName,CodeFile.fromJson(newFjs));
        }
      } 
      let after=[this.tags,new Set(this.langs.keys())];
      this._modifyCout(diffSet(before[0],after[0]), diffSet(before[1],after[1]));
    });
    return [true, null];
  }
  static async fetchStar(id: string, auth: Auth) {
    try {
      await axios(auth.axiosCfg(`/gists/${id}/star`));
      return true;
    } catch (err) {
      return false;
    }
  }
  static async fromJson(gj: GistJson, auth: Auth, modifyCout: F) {
    let files = Object.values(gj.files).map(fj => CodeFile.fromJson(fj));
    let ct = new Date(gj.created_at);
    let ut = new Date(gj.updated_at);
    let isStarred = await Gist.fetchStar(gj.id, auth);
    return new Gist(
      gj.id,
      gj.description,
      isStarred,
      gj.public,
      ct,
      ut,
      files,
      auth,
      modifyCout
    );
  }
}
