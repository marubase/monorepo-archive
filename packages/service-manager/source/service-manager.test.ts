import { expect } from "chai";
import { ServiceManagerError } from "./errors/service-manager.error.js";
import { ServiceManager } from "./service-manager.js";
import { ServiceManagerProvider } from "./service-manager.provider.js";
import { ServiceRequest } from "./service-request.js";
import { ServiceRouter } from "./service-router.js";

describe("ServiceManager", function () {
  let manager: ServiceManager;
  beforeEach(async function () {
    manager = new ServiceManager();
    manager.install(ServiceManagerProvider.name, new ServiceManagerProvider());
  });

  describe("get routers", function () {
    it("should return routers", async function () {
      expect(manager.routers).to.deep.equal([]);
    });
  });

  describe("get services", function () {
    it("should return services", async function () {
      expect(manager.services).to.deep.equal({});
    });
  });

  describe("#configure(name, configureFn)", function () {
    context("when there is router", function () {
      it("should return self", async function () {
        const configureFn = (): void => undefined;
        manager.configure("test", configureFn);

        const self = manager.configure("test", configureFn);
        expect(self).to.equal(manager);
      });
    });
    context("when there is no router", function () {
      it("should return self", async function () {
        const configureFn = (): void => undefined;

        const self = manager.configure("test", configureFn);
        expect(self).to.equal(manager);
      });
    });
  });

  describe("#dispatch(request)", function () {
    it("should resolve response", async function () {
      const configureFn = (): void => undefined;
      manager.configure("test", configureFn);
      manager.host("http://127.0.0.1", "test");
      const request = manager.request("GET", "/", "http://127.0.0.1");

      const response = await manager.dispatch(request);
      expect(response.statusCode).to.equal(404);
    });
  });

  describe("#host(origin, name)", function () {
    context("when there is no router", function () {
      it("should return self", async function () {
        const process = (): unknown => manager.host("http://127.0.0.1", "test");
        expect(process).to.throw(ServiceManagerError);
      });
    });
    context("when there is existing service", function () {
      it("should return self", async function () {
        const configureFn = (): void => undefined;
        manager.configure("test", configureFn);
        manager.host("http://127.0.0.1", "test");

        const process = (): unknown => manager.host("http://127.0.0.1", "test");
        expect(process).to.throw(ServiceManagerError);
      });
    });
    context("when there is no existing service", function () {
      it("should return self", async function () {
        const configureFn = (): void => undefined;
        manager.configure("test", configureFn);

        const self = manager.host("http://127.0.0.1", "test");
        expect(self).to.equal(manager);
      });
    });
  });

  describe("#request(method, path, origin)", function () {
    it("should return request", async function () {
      const request = manager.request("GET", "/", "http://127.0.0.1");
      expect(request).to.be.an.instanceOf(ServiceRequest);
    });
  });

  describe("#router(name)", function () {
    context("when there is router", function () {
      it("should return router", async function () {
        const configureFn = (): void => undefined;
        manager.configure("test", configureFn);

        const router = manager.router("test");
        expect(router).to.be.an.instanceOf(ServiceRouter);
      });
    });
    context("when there is no router", function () {
      it("should return router", async function () {
        const process = (): unknown => manager.router("test");
        expect(process).to.throw(ServiceManagerError);
      });
    });
  });

  describe("#service(origin)", function () {
    context("when there is service", function () {
      it("should return router", async function () {
        const configureFn = (): void => undefined;
        manager.configure("test", configureFn);
        manager.host("http://127.0.0.1", "test");

        const router = manager.service("http://127.0.0.1");
        expect(router).to.be.an.instanceOf(ServiceRouter);
      });
    });
    context("when there is no service", function () {
      it("should return router", async function () {
        const process = (): unknown => manager.service("http://127.0.0.1");
        expect(process).to.throw(ServiceManagerError);
      });
    });
  });

  describe("#unhost(origin)", function () {
    context("when there is service", function () {
      it("should return self", async function () {
        const configureFn = (): void => undefined;
        manager.configure("test", configureFn);
        manager.host("http://127.0.0.1", "test");

        const self = manager.unhost("http://127.0.0.1");
        expect(self).to.equal(manager);
      });
    });
    context("when there is no service", function () {
      it("should return router", async function () {
        const process = (): unknown => manager.unhost("http://127.0.0.1");
        expect(process).to.throw(ServiceManagerError);
      });
    });
  });
});
