import { StorageContract } from "@marubase/storage";
import { DataStoreContract } from "./contracts/datastore.contract.js";

export class DataStore implements DataStoreContract {
  protected _storage: StorageContract;

  public constructor(storage: StorageContract) {
    this._storage = storage;
  }

  public get storage(): StorageContract {
    return this._storage;
  }
}
