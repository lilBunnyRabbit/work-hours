import { ServiceObserver } from "@lilbunnyrabbit/service-observer";
import { PickPartial } from "../../utils/type.util";
import { WHFile, WHFileBase, WHFileMetadata, isWHFile } from "../WHFile";
import { WHFileHandler } from "../WHFileHandler";
import migrationService, { SupportedVersions, isLatestVersion, isSupportedWHFile } from "./migration.service";

// https://developer.chrome.com/articles/file-system-access/
const { showOpenFilePicker, showSaveFilePicker }: any = window;
export type FileHandle = any;

export class WHFileService {
  static NAME = "Work Hours File";

  static TYPE = {
    description: "Work Hours Files",
    accept: {
      "application/json": [".whf"],
    },
  };

  public getFileMetadata(file: File): WHFileMetadata {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      webkitRelativePath: file.webkitRelativePath,
    };
  }

  public validate<TFile extends WHFileBase<SupportedVersions>>(whFile: unknown): TFile {
    if (!isWHFile(whFile)) {
      throw new Error(`File is not a valid "${WHFileService.NAME}".`);
    }

    if (!isSupportedWHFile(whFile)) {
      throw new Error(`"${WHFileService.NAME}" version is not supported.`);
    }

    return whFile as TFile;
  }

  public parse(content: string): WHFileBase<SupportedVersions> {
    try {
      const parsed = JSON.parse(content);

      return this.validate(parsed);
    } catch {
      throw new Error("File is not a valid JSON.");
    }
  }

  readonly open = ServiceObserver.bind(this._open.bind(this));
  public async _open(
    observer: ServiceObserver<{
      writing: boolean;
    }>
  ) {
    const [fileHandle] = await showOpenFilePicker({
      types: [WHFileService.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("File is not a file.");

    const file: File = await fileHandle.getFile();
    const content: string = await file.text();

    let data = this.parse(content);
    if (!isLatestVersion(data)) {
      const [migrated, log] = migrationService.migrate(data);
      console.info(`"${WHFileService.NAME}" migration log:`, log);

      data = await this._write<WHFile.default>(observer, fileHandle, migrated);
    }

    if (!isLatestVersion(data)) {
      throw new Error(`Failed to migrate "${WHFileService.NAME}" to the latest version.`);
    }

    const metadata = this.getFileMetadata(file);

    return new WHFileHandler(fileHandle, data, metadata);
  }

  readonly create = ServiceObserver.bind(this._create.bind(this));
  private async _create(
    observer: ServiceObserver<{
      writing: boolean;
    }>
  ) {
    const fileHandle = await showSaveFilePicker({
      types: [WHFileService.TYPE],
    });

    if (fileHandle.kind !== "file") throw new Error("File is not a file.");

    const file: File = await fileHandle.getFile();

    const data = await this._write<WHFile.default>(observer, fileHandle, WHFile.INITIAL_DATA);
    if (!isLatestVersion(data)) {
      throw new Error(`Failed to create "${WHFileService.NAME}" with the latest version.`);
    }

    const metadata = this.getFileMetadata(file);

    return new WHFileHandler(fileHandle, data, metadata);
  }

  readonly write = ServiceObserver.bind(this._write.bind(this));
  private async _write<TFile extends WHFileBase<SupportedVersions>>(
    observer: ServiceObserver<{
      writing: boolean;
    }>,
    fileHandle: FileHandle,
    data: PickPartial<TFile, "__lastUpdated">
  ) {
    const writeData = this.validate<TFile>({
      ...data,
      __lastUpdated: Date.now(),
    });

    observer.emit("writing", true);

    try {
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(writeData));
      await writable.close();

      observer.emit("writing", false);
      return writeData;
    } catch (error) {
      console.error(error);

      observer.emit("writing", false);
      throw error;
    }
  }
}

export default new WHFileService();
