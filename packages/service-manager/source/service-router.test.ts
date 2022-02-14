import { expect } from "chai";
import { ServiceManagerInterface } from "./contracts/service-manager.contract.js";
import { ServiceManager } from "./service-manager.js";
import { ServiceManagerProvider } from "./service-manager.provider.js";
import { ServiceRequest } from "./service-request.js";
import { ServiceRouter } from "./service-router.js";

describe("ServiceRouter", function () {
  let manager: ServiceManagerInterface;
  let router: ServiceRouter;
  before(async function () {
    manager = new ServiceManager();
    manager.install(ServiceManagerProvider.name, new ServiceManagerProvider());
  });
  after(async function () {
    manager.uninstall(ServiceManagerProvider.name);
  });

  beforeEach(async function () {
    router = new ServiceRouter(manager);
  });

  describe("#configure(configureFn)", function () {
    it("should return self", async function () {
      const configureFn = (): void => undefined;

      const self = router.configure(configureFn);
      expect(self).to.equal(router);
    });
  });

  describe("#dispatch(request)", function () {
    context("when there is no handler", function () {
      it("should return response", async function () {
        const request = router.request("GET", "/");
        const response = await router.dispatch(request);
        expect(response.statusCode).to.equal(404);
      });
    });
    context("when there is no matching method", function () {
      it("should return response", async function () {
        router.method(["POST", "PUT"]).handle(async (context) => {
          return context.replyWith(200);
        });

        const request = router.request("GET", "/");
        const response = await router.dispatch(request);
        expect(response.statusCode).to.equal(404);
      });
    });
    context("when there is no matching path", function () {
      it("should return response", async function () {
        router.path("/skip").handle(async (context) => {
          return context.replyWith(200);
        });

        const request = router.request("GET", "/");
        const response = await router.dispatch(request);
        expect(response.statusCode).to.equal(404);
      });
    });
    context("when there handler throwing error", function () {
      it("should return response", async function () {
        router.handle(async () => {
          throw new Error("test error");
        });

        const request = router.request("GET", "/");
        const response = await router.dispatch(request);
        expect(response.statusCode).to.equal(500);
      });
    });
    context("when there is no matching method (nested)", function () {
      it("should return response", async function () {
        const nested = new ServiceRouter(manager);
        nested.method(["POST", "PUT"]).handle(async (context) => {
          return context.replyWith(200);
        });
        router.handle(nested);

        const request = router.request("GET", "/");
        const response = await router.dispatch(request);
        expect(response.statusCode).to.equal(404);
      });
    });
    context("when there is no matching path (nested)", function () {
      it("should return response", async function () {
        const nested = new ServiceRouter(manager);
        nested.path("/skip").handle(async (context) => {
          return context.replyWith(200);
        });
        router.handle(nested);

        const request = router.request("GET", "/");
        const response = await router.dispatch(request);
        expect(response.statusCode).to.equal(404);
      });
    });
  });

  describe("#handle(handler)", function () {
    it("should run", async function () {
      router.handle(async (context) => {
        return context.replyWith(200);
      });

      const response = await router.request("GET", "/").dispatch();
      expect(response.statusCode).equal(200);
    });
  });

  describe("#method(method).handle(handler)", function () {
    it("should run", async function () {
      router.method("GET").handle(async (context) => {
        return context.replyWith(200);
      });

      const response = await router.request("GET", "/").dispatch();
      expect(response.statusCode).equal(200);
    });
  });

  describe("#method(method).handle(router)", function () {
    it("should run", async function () {
      const nested = new ServiceRouter(manager);
      nested.handle(async (context) => {
        return context.replyWith(200);
      });
      router.method("GET").handle(nested);

      const response = await router.request("GET", "/").dispatch();
      expect(response.statusCode).equal(200);
    });
  });

  describe("#method(method).path(path).handle(handler)", function () {
    it("should run", async function () {
      router
        .method("GET")
        .path("/")
        .handle(async (context) => {
          return context.replyWith(200);
        });

      const response = await router.request("GET", "/").dispatch();
      expect(response.statusCode).equal(200);
    });
  });

  describe("#path(path).handle(handler)", function () {
    it("should run", async function () {
      router.path("/").handle(async (context) => {
        return context.replyWith(200);
      });

      const response = await router.request("GET", "/").dispatch();
      expect(response.statusCode).equal(200);
    });
  });

  describe("#path(path).handle(router)", function () {
    it("should run", async function () {
      const nested = new ServiceRouter(manager);
      nested.handle(async (context) => {
        return context.replyWith(200);
      });
      router.path("/").handle(nested);

      const response = await router.request("GET", "/").dispatch();
      expect(response.statusCode).equal(200);
    });
  });

  describe("#request(method, path)", function () {
    it("should return request", async function () {
      const request = router.request("GET", "/");
      expect(request).to.be.an.instanceOf(ServiceRequest);
    });
  });
});
