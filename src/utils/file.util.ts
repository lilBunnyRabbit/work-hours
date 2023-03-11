const { showOpenFilePicker, showSaveFilePicker }: any = window;
type FileHandle = any;

interface IWHFile {

}

export class WHFile {
  static TYPE = {
    description: "Work Hours Files",
    accept: {
      "text/plain": [".whf"],
    },
  };

  private fileHandle: FileHandle | null = null;

  constructor() {}

  static async openFilePicker(): Promise<File | null> {
    const [fileHandle] = await showOpenFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") return null;

    const file: File = await fileHandle.getFile();
    const contents = await file.text();

    console.log({ file, contents });
    WHFile.saveFile();
    return file;
  }

  static async saveFile() {
    const options = {
      types: [WHFile.TYPE],
    };
    const handle = await showSaveFilePicker(options);
    return handle;
  }

  public async open() {
    const [fileHandle] = await showOpenFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    this.fileHandle = fileHandle;
    return fileHandle;
  }

  public async create() {
    const fileHandle = await showSaveFilePicker({
      types: [WHFile.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("Not a file.");

    this.fileHandle = fileHandle;
    return fileHandle;
  }

  public async getFile() {
    if (!this.fileHandle) throw new Error("No selected file.");

    const file: File = await this.fileHandle.getFile();
    return file;
  }

  public async write(contents: string) {
    if (!this.fileHandle) throw new Error("No selected file.");

    const writable = await this.fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }
}
