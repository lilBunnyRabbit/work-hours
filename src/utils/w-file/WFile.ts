import { isObject } from "../type.util";

const { showOpenFilePicker, showSaveFilePicker }: any = window;
type FileHandle = any;

// https://developer.chrome.com/articles/file-system-access/

const VERSION: IWHFile["__version"] = "whf_0.0.0";

const INITIAL_DATA: Omit<IWHFile, "__version"> = {}; 

export interface IWHFile {
  __version: `whf_${number}.${number}.${number}`;
}

const isWHFile = (value: unknown): value is IWHFile => {
  const regex = /whf_\d+\.\d+\.\d+/;

  return (
    isObject(value) && "__version" in value && typeof value["__version"] === "string" && regex.test(value["__version"])
  );
};

export class WHFile {
  static TYPE = {
    description: "Work Hours Files",
    accept: {
      "application/json": [".whf"],
    },
  };

  constructor(private fileHandle: FileHandle) {}

  static async open(): Promise<[WHFile, IWHFile]> {
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

    return [new WHFile(fileHandle), data];
  }

  static async create(): Promise<[WHFile, IWHFile]> {
    const fileHandle = await showSaveFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    const whFile = new WHFile(fileHandle);
    const data = await whFile.write(INITIAL_DATA);

    return [whFile, data];
  }

  public async getFile() {
    if (!this.fileHandle) throw new Error("No selected file.");

    const file: File = await this.fileHandle.getFile();
    return file;
  }

  public async write(data: Omit<IWHFile, "__version">): Promise<IWHFile> {
    if (!this.fileHandle) throw new Error("No selected file.");

    const writeData: IWHFile = { ...data, __version: VERSION };

    const writable = await this.fileHandle.createWritable();
    await writable.write(JSON.stringify(writeData));
    await writable.close();

    return writeData;
  }
}
