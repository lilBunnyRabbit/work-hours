import { sendFileEvent, showNotification } from "../layouts/Toolbar";
import { WHFile, WHFileBase, WHFileMetadata } from "./WHFile";
import { SupportedVersions } from "./services/migration.service";
import whFileService, { FileHandle } from "./services/whFile.service";

export class WHFileHandler<TFile extends WHFileBase<SupportedVersions> = WHFile.default> {
  constructor(readonly fileHandle: FileHandle, private _data: TFile, readonly metadata: WHFileMetadata) {
    console.log("new", this);
  }

  get data() {
    return this._data;
  }

  set data(data: TFile) {
    this._data = data;
  }
}
