import { storageTest } from "@marubase/storage-adapter";
import fs from "node:fs/promises";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: Storage;
  beforeEach(async function () {
    storage = await Storage.open("data");
  });
  afterEach(async function () {
    await storage.close();
  });
  after(async function () {
    await fs.rm("data", { force: true, recursive: true });
  });

  storageTest(() => storage);
});
