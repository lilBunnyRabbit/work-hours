import { PickPartial } from "../type.util";
import { isWHFile, IWHFile, IWHFileDay, IWHFileMetadata } from "./WHFileTypes";

const { showOpenFilePicker, showSaveFilePicker }: any = window;
type FileHandle = any;

// https://developer.chrome.com/articles/file-system-access/

export const WHF_VERSION: IWHFile["__version"] = "whf_0.0.0";

export const INITIAL_DAY: IWHFileDay = {
  workLogs: [],
  tasks: [],
  notes: [],
};

const INITIAL_DATA: PickPartial<IWHFile, "__version" | "__lastUpdated"> = {};

export class WHFile {
  static TYPE = {
    description: "Work Hours Files",
    accept: {
      "application/json": [".whf"],
    },
  };

  private _metadata: IWHFileMetadata | null = null;

  get metadata() {
    return this._metadata;
  }

  constructor(private fileHandle: FileHandle) {}

  static getFileMetadata(file: File): IWHFileMetadata {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      webkitRelativePath: file.webkitRelativePath,
    };
  }

  static parse(content: string): IWHFile {
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('File is not a valid "Work Hours File".');
    }
  }

  static validate(data: unknown): IWHFile {
    if (!isWHFile(data)) throw new Error('File is not a valid "Work Hours File".');
    return data;
  }

  static async open(): Promise<[WHFile, IWHFile]> {
    const [fileHandle] = await showOpenFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    const file: File = await fileHandle.getFile();
    const content: string = await file.text();

    const data = WHFile.validate(WHFile.parse(content));

    const whFile = new WHFile(fileHandle);
    whFile._metadata = WHFile.getFileMetadata(file);

    return [whFile, data];
  }

  static async create(): Promise<[WHFile, IWHFile]> {
    const fileHandle = await showSaveFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    const whFile = new WHFile(fileHandle);
    const file: File = await fileHandle.getFile();
    whFile._metadata = WHFile.getFileMetadata(file);
    const data = await whFile.write(INITIAL_DATA);

    return [whFile, data];
  }

  public async write(data: PickPartial<IWHFile, "__version" | "__lastUpdated">): Promise<IWHFile> {
    if (!this.fileHandle) throw new Error("No selected file.");

    const writeData: IWHFile = WHFile.validate({ ...data, __version: WHF_VERSION, __lastUpdated: Date.now() });

    const writable = await this.fileHandle.createWritable();
    await writable.write(JSON.stringify(writeData));
    await writable.close();

    return writeData;
  }

  public async getFile(): Promise<File> {
    if (!this.fileHandle) throw new Error("No selected file.");

    const file: File = await this.fileHandle.getFile();
    return file;
  }

  public async getData(): Promise<IWHFile> {
    const file = await this.getFile();
    const content = await file.text();
    this._metadata = WHFile.getFileMetadata(file);

    return WHFile.validate(WHFile.parse(content));
  }
}
