import { IZipEntry } from "adm-zip";

export interface ICertificate {
  _isLegit: boolean,
  _jsonEntry: IZipEntry,
  _cache?: IZipEntry[]
}

export class Entry {
  public entry: IZipEntry;

  constructor(entry: IZipEntry) {
    this.entry = entry;
  }
}

export default class Certificate {
  private _isLegit = true;
  private _jsonEntry: IZipEntry;
  private _cache?: IZipEntry[];
  
  constructor(certificate: {_isLegit: boolean, _jsonEntry: IZipEntry, _cache?: IZipEntry[]} | ICertificate) {
    this._isLegit = certificate._isLegit;
    this._jsonEntry = certificate._jsonEntry;
    if (certificate._cache) this._cache = certificate._cache;
  }

  public get isLegit() {
    return this._isLegit;
  }

  public set isLegit(isLegit: boolean) {
    this._isLegit = isLegit;
  }

  public get jsonEntry() {
    return this._jsonEntry;
  }

  public set jsonEntry(jsonEntry: IZipEntry) {
    this._jsonEntry = jsonEntry;
  }

  public get cache() {
    return this._cache;
  }

  public set cache(cache: IZipEntry[] | undefined) {
    this._cache = cache;
  }
}