import { sendFileEvent } from "../layouts/Toolbar";
import { PickPartial } from "../utils/type.util";
import { WHFileMigrator } from "./WHFileMigratior";
import { WHFile, WHFileMetadata, isSupportedWHFile, isWHFile } from "./types/WHFileTypes";

// https://developer.chrome.com/articles/file-system-access/
const { showOpenFilePicker, showSaveFilePicker }: any = window;
type FileHandle = any;

export class WHFileHandler {
  static TYPE = {
    description: "Work Hours Files",
    accept: {
      "application/json": [".whf"],
    },
  };

  private _metadata: WHFileMetadata | null = null;

  get metadata() {
    return this._metadata;
  }

  constructor(private fileHandle: FileHandle) {}

  static getFileMetadata(file: File): WHFileMetadata {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      webkitRelativePath: file.webkitRelativePath,
    };
  }

  static parse(content: string): WHFile.default {
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('File is not a valid "Work Hours File".');
    }
  }

  static validate(data: unknown): WHFile.default {
    if (!isWHFile<WHFile.default>(data)) throw new Error('File is not a valid "Work Hours File".');
    if (!isSupportedWHFile(data)) throw new Error('"Work Hours File" version is not supported.');
    return data;
  }

  static async open(): Promise<[WHFileHandler, WHFile.default]> {
    const [fileHandle] = await showOpenFilePicker({
      types: [WHFileHandler.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    const file: File = await fileHandle.getFile();
    const content: string = await file.text();

    let data = WHFileHandler.validate(WHFileHandler.parse(content));

    const whFile = new WHFileHandler(fileHandle);
    if (data.__version !== WHFile.VERSION) {
      const migration = WHFileMigrator.migrate(data);
      await whFile.write(migration);
      console.info(`"Work Hours File" migrated from "${data.__version}" to "${migration.__version}".`);
      data = migration;
    }

    whFile._metadata = WHFileHandler.getFileMetadata(file);

    return [whFile, data];
  }

  static async create(): Promise<[WHFileHandler, WHFile.default]> {
    const fileHandle = await showSaveFilePicker({
      types: [WHFileHandler.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    const whFile = new WHFileHandler(fileHandle);
    const file: File = await fileHandle.getFile();
    whFile._metadata = WHFileHandler.getFileMetadata(file);
    const data = await whFile.write(WHFile.INITIAL_DATA);

    return [whFile, data];
  }

  public async write(data: PickPartial<WHFile.default, "__version" | "__lastUpdated">): Promise<WHFile.default> {
    if (!this.fileHandle) throw new Error("No selected file.");

    const writeData: WHFile.default = WHFileHandler.validate({
      ...data,
      __version: WHFile.VERSION,
      __lastUpdated: Date.now(),
    });

    sendFileEvent({ action: "writing", active: true });
    try {
      const writable = await this.fileHandle.createWritable();
      await writable.write(JSON.stringify(writeData));
      await writable.close();

      sendFileEvent({ action: "writing", active: false });

      return writeData;
    } catch (error) {
      console.error(error);

      sendFileEvent({ action: "writing", active: false });

      throw error;
    }
  }

  public async getFile(): Promise<File> {
    if (!this.fileHandle) throw new Error("No selected file.");

    const file: File = await this.fileHandle.getFile();
    return file;
  }

  public async getData(): Promise<WHFile.default> {
    const file = await this.getFile();
    const content = await file.text();
    this._metadata = WHFileHandler.getFileMetadata(file);

    return WHFileHandler.validate(WHFileHandler.parse(content));
  }
}
