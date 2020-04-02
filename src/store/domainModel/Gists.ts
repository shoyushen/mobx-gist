import { observable, action, autorun, runInAction } from "mobx";
import axios from "axios";
import { Gist, GistJson } from "./Gist";
import { AddGist } from "./Add";
import { Auth } from "./Auth";
import { diffSet, setCout, addMap } from "../Helper";

export class Gists {
  @observable gists = new Map<string, Gist>();
  @observable languages = new Map<string, number>();
  @observable tags = new Map<string, number>();
  @observable isLoaded = false;

  private static autoLoadClear(gists: Gists) {
    autorun(() => {
      if (!gists._auth.isAuthed && gists.isLoaded) {
        gists.clear();
      }
      if (gists._auth.isAuthed && !gists.isLoaded) {
        gists.load();
      }
    });
  }

  constructor(private _auth: Auth) {
    Gists.autoLoadClear(this);
  }

  async addGist(ag: AddGist) {
    let resp = await axios({
      ...this._auth.axiosCfg(`/gists`, "post"),
      data: ag.genAdd()
    });
    let gj = resp.data as GistJson;
    let gist = await Gist.fromJson(gj, this._auth, this.modifyCout);
    this.modifyCout(diffSet(null, gist.tags), diffSet(null, new Set(gist.langs.keys())));
    this.gists.set(gist.id, gist);
  }
  async deleteGist(id: string) {
    await axios({
      ...this._auth.axiosCfg(`/gists/${id}`, "delete")
    });
    let gist = this.gists.get(id)!;
    this.modifyCout(diffSet(gist.tags, null), diffSet(new Set(gist.langs.keys()), null));
    this.gists.delete(id);
  }
  @action.bound
  modifyCout(tagsDiff: Map<string, number>, langsDiff: Map<string, number>) {
    addMap(this.tags, tagsDiff);
    addMap(this.languages, langsDiff);
  }
  @action
  private clear() {
    this.gists.clear();
    this.languages.clear();
    this.tags.clear();
    this.isLoaded = false;
  }
  private async load() {
    let resp = await axios(this._auth.axiosCfg("/gists"));
    let gists = resp.data as GistJson[];
    for await (const gist of gists.map(g =>
      Gist.fromJson(g, this._auth, this.modifyCout)
    )) {
      this.gists.set(gist.id, gist);
      this.modifyCout(diffSet(null, gist.tags), diffSet(null, new Set(gist.langs.keys())));
    }
    this.isLoaded = true;
  }
}
