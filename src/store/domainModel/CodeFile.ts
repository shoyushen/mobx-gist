import { observable, runInAction } from "mobx";

export interface FileJson {
  filename: string;
  language: string;
  raw_url: string;
  content?: string;
}

export class CodeFile {
  @observable fileName: string;
  @observable language: string;
  @observable rawUrl: string;
  @observable content?: string;
  constructor(
    fileName: string,
    language: string,
    rawUrl: string,
    content?: string
  ) {
    this.fileName = fileName;
    this.language = language;
    this.rawUrl = rawUrl;
    this.content = content;
  }
  update(up: FileJson) {
    this.fileName = up.filename;
    this.language = up.language;
    this.rawUrl = up.raw_url;
    this.content = up.content;
  }
  static fromJson(fj: FileJson) {
    return new CodeFile(fj.filename, fj.language, fj.raw_url, fj.content);
  }
}
