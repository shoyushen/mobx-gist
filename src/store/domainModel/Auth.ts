import { observable, action, computed, autorun, runInAction } from "mobx";
import { User } from "./User";
import axios from "axios";
import { axiosCfgGen } from "../Helper";

export class Auth {
  @observable private _token: string = "";
  @observable.ref user: User | null = null;

  private static autoSaveToken(auth: Auth) {
    let firstRun = true;
    autorun(() => {
      if (firstRun && localStorage.getItem("token") !== null) {
        runInAction(() => {
          auth._token = localStorage.getItem("token")!;
        });
      } else if (auth._token === "") {
        localStorage.removeItem("token");
      } else {
        localStorage.setItem("token", auth._token);
      }
    });
    firstRun = false;
  }
  private static autoFetchUser(auth: Auth) {
    autorun(() => {
      if (auth.isAuthed) {
        auth.fetchUser();
      } else {
        auth.user = null;
      }
    });
  }

  constructor() {
    Auth.autoSaveToken(this);
    Auth.autoFetchUser(this);
  }
  @computed
  get axiosCfg() {
    return axiosCfgGen(this._token);
  }
  @computed
  get isAuthed() {
    if (this._token === "") {
      return false;
    } else {
      return true;
    }
  }
  @action.bound
  login() {
    this._token = "enter your oauth code there";
  }
  @action.bound
  logout() {
    this._token = "";
  }
  private async fetchUser() {
    let resp = await axios(this.axiosCfg("/user"));
    runInAction(() => {
      this.user = new User(resp.data.login, resp.data.avatar_url);
    });
  }
}
