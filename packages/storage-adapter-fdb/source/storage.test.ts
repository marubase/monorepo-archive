import { storageTest } from "@marubase/storage-adapter";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: Storage;
  beforeEach(async function () {
    storage = await Storage.open();
  });
  afterEach(async function () {
    await storage.close();
  });

  storageTest(() => storage);
});