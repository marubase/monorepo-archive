import { StorageContract } from "@marubase/storage";

export interface DataStoreContract {
  readonly storage: StorageContract;
}
