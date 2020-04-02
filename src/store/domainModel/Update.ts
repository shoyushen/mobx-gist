import { Gist } from "./Gist";
import { CodeFile } from "./CodeFile";
import { genUUID, hasSame } from "../Helper";

type FU = { content?: string; filename?: string };
type UpGen = {
  files: Record<string, FU | null>;
  description?: string;
};

export class UpdateFile {
  isDeleted = false;
  constructor(
    public fileName: string,
    public content: string,
    public file?: CodeFile
  ) {}
  genUpdate(): [string, FU | null | undefined] {
    if (this.file === undefined) {
      return [this.fileName, { content: this.content }];
    } else {
      let obj: FU = {};
      if (this.file.fileName !== this.fileName) {
        obj.filename = this.fileName;
      }
      if (this.file.content !== this.content) {
        obj.content = this.content;
      }
      return [this.file.fileName, obj];
    }
  }
  check(): [boolean, string | null] {
    if (this.isDeleted) {
      return [true, null];
    }
    if (this.fileName === "") {
      return [false, "File name can't be empty!"];
    } else if (this.content === "") {
      return [false, "Content can't be empty!"];
    } else if (
      this.file &&
      this.file.fileName === this.fileName &&
      this.file.content === this.content
    ) {
      return [false, "unchange!"];
    }
    return [true, null];
  }
}

export class UpdateGist {
  description: string;
  updateFiles = new Map<string, UpdateFile>();
  constructor(public gist: Gist) {
    this.description = gist.description;
    gist.files.forEach(f => {
      this.updateFiles.set(
        f.fileName,
        new UpdateFile(f.fileName, f.content!, f)
      );
    });
  }
  addFile(): string {
    let randName = genUUID();
    this.updateFiles.set(randName, new UpdateFile("", ""));
    return randName;
  }
  removeFile(fileName: string) {
    if (this.updateFiles.get(fileName)!.file === undefined) {
      this.updateFiles.delete(fileName);
    } else {
      this.updateFiles.get(fileName)!.isDeleted = true;
    }
  }
  genUpdate(): UpGen {
    let files: Record<string, FU | null> = {};
    this.updateFiles.forEach(f => {
      let [name, update] = f.genUpdate();
      if (update !== undefined) {
        files[name] = update;
      }
    });
    if (this.description === this.gist.description) {
      return { files };
    }
    return {
      description: this.description,
      files
    };
  }
  check(): [boolean, string | null] {
    let fArr = Array.from(this.updateFiles.values());
    for (const [flag, err] of fArr.map(f => f.check())) {
      if (!flag) {
        return [flag, err];
      }
    }
    let changeNameArr = fArr
      .filter(f => f.file !== undefined)
      .filter(f => f.file!.fileName !== f.fileName);
    let restArr = [
      ...fArr.filter(f => f.file === undefined).map(f => f.fileName),
      ...fArr
        .filter(f => f.file !== undefined)
        .filter(f => f.file!.fileName === f.fileName)
        .map(f => f.fileName)
    ];
    if (
      hasSame([
        ...changeNameArr.map(f => f.fileName),
        ...changeNameArr.map(f => f.file!.fileName),
        ...restArr
      ])
    ) {
      return [false, "Filename repeat!"];
    }
    return [true, null];
  }
}
