import { storageTest } from "@marubase/storage-adapter";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: Storage;
  before(async function () {
    storage = await Storage.open();
  });
  after(async function () {
    await storage.close();
  });

  storageTest(() => storage);
});
