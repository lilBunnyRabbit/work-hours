import { PickPartial } from "../type.util";
import { isWHFile, IWHFile, IWHFileDay, IWHFileMetadata } from "./WHFileTypes";

const { showOpenFilePicker, showSaveFilePicker }: any = window;
type FileHandle = any;

// https://developer.chrome.com/articles/file-system-access/

export const WHF_VERSION: IWHFile["__version"] = "whf_0.0.0";

export const INITIAL_DAY: IWHFileDay = {
  workLog: [],
  tasks: [],
  notes: [],
};

const INITIAL_DATA: PickPartial<IWHFile, "__version"> = {};

export class WHFile {
  static TYPE = {
    description: "Work Hours Files",
    accept: {
      "application/json": [".whf"],
    },
  };

  constructor(private fileHandle: FileHandle) {}

  static async open(): Promise<[WHFile, IWHFile, IWHFileMetadata]> {
    const [fileHandle] = await showOpenFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    const file: File = await fileHandle.getFile();
    const content: string = await file.text();

    let data: IWHFile | null = null;
    try {
      data = JSON.parse(content);
      if (!isWHFile(data)) throw new Error('File is not a valid "Work Hours File".');
    } catch {
      throw new Error('File is not a valid "Work Hours File".');
    }

    return [new WHFile(fileHandle), data, { filename: file.name }];
  }

  static async create(): Promise<[WHFile, IWHFile, IWHFileMetadata]> {
    const fileHandle = await showSaveFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    const whFile = new WHFile(fileHandle);
    const file: File = await fileHandle.getFile();

    const data = await whFile.write(INITIAL_DATA);

    return [whFile, data, { filename: file.name }];
  }

  public async getFile() {
    if (!this.fileHandle) throw new Error("No selected file.");

    const file: File = await this.fileHandle.getFile();
    return file;
  }

  public async write(data: PickPartial<IWHFile, "__version">): Promise<IWHFile> {
    if (!this.fileHandle) throw new Error("No selected file.");

    const writeData: IWHFile = { ...data, __version: WHF_VERSION };

    const writable = await this.fileHandle.createWritable();
    await writable.write(JSON.stringify(writeData));
    await writable.close();

    return writeData;
  }
}
