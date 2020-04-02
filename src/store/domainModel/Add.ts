import { genUUID, hasSame } from "../Helper";

export class AddFile {
  fileName = "";
  content = "";
  genAdd(): [string, { content: string }] {
    return [this.fileName, { content: this.content }];
  }
  check(): [boolean, string | null] {
    if (this.fileName === "") {
      return [false, "File name can't be empty!"];
    } else if (this.content === "") {
      return [false, "Content can't be empty!"];
    }
    return [true, null];
  }
}
export class AddGist {
  description = "";
  public = true;
  addFiles = new Map<string, AddFile>();

  addFile(): string {
    let uuid = genUUID();
    this.addFiles.set(uuid, new AddFile());
    return uuid;
  }
  removeFile(uuid: string) {
    this.addFiles.delete(uuid);
  }
  genAdd() {
    let files: Record<string, { content: string }> = {};
    this.addFiles.forEach(f => {
      let [name, add] = f.genAdd();
      files[name] = add;
    });
    return {
      description: this.description,
      public: this.public,
      files
    };
  }
  check(): [boolean, string | null] {
    let fArr = Array.from(this.addFiles.values());
    for (const [flag, err] of fArr.map(f => f.check())) {
      if (!flag) {
        return [flag, err];
      }
    }
    if (hasSame(fArr.map(f => f.fileName))) {
      return [false, "Filename repeat!"];
    }
    return [true, null];
  }
  clear(){
    this.description = "";
    this.public = true;
    this.addFiles = new Map<string, AddFile>();
  }
}
