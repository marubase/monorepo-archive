import { Readable } from "@marubase-tools/stream";
import { Callable } from "@marubase/container";
import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import { ServiceManagerInterface } from "./contracts/service-manager.contract.js";
import { ServiceRequestInterface } from "./contracts/service-request.contract.js";
import {
  ServiceResponseContract,
  ServiceResponseInterface,
} from "./contracts/service-response.contract.js";
import { ServiceRouterInterface } from "./contracts/service-router.contract.js";
import { ServiceContext } from "./service-context.js";

describe("ServiceContext", function () {
  let mockManager: ServiceManagerInterface;
  let mockRequest: ServiceRequestInterface;
  let mockResponse: ServiceResponseInterface;
  let mockRouter: ServiceRouterInterface;
  let contextTarget: ServiceContext;
  let manager: ServiceManagerInterface;
  let request: ServiceRequestInterface;
  let response: ServiceResponseInterface;
  let router: ServiceRouterInterface;
  beforeEach(async function () {
    mockManager = mock();
    mockRequest = mock();
    mockResponse = mock();
    mockRouter = mock();
    manager = instance(mockManager);
    request = instance(mockRequest);
    response = instance(mockResponse);
    router = instance(mockRouter);
    contextTarget = new ServiceContext(manager, request);
  });
  afterEach(async function () {
    reset(mockManager);
    reset(mockRequest);
    reset(mockResponse);
    reset(mockRouter);
  });

  describe("get body", function () {
    it("should return body", async function () {
      when(mockRequest.body).thenReturn(Readable.from([]));
      expect(contextTarget.body).to.have.property("read");
    });
  });

  describe("get credential", function () {
    it("should return credential", async function () {
      when(mockRequest.credential).thenReturn("token");
      expect(contextTarget.credential).to.equal("token");
    });
  });

  describe("get hash", function () {
    it("should return hash", async function () {
      when(mockRequest.hash).thenReturn("hash");
      expect(contextTarget.hash).to.equal("hash");
    });
  });

  describe("get headers", function () {
    it("should return headers", async function () {
      when(mockRequest.headers).thenReturn({});
      expect(contextTarget.headers).to.deep.equal({});
    });
  });

  describe("get hostname", function () {
    it("should return hostname", async function () {
      when(mockRequest.hostname).thenReturn("127.0.0.1");
      expect(contextTarget.hostname).to.equal("127.0.0.1");
    });
  });

  describe("get method", function () {
    it("should return method", async function () {
      when(mockRequest.method).thenReturn("GET");
      expect(contextTarget.method).to.equal("GET");
    });
  });

  describe("get origin", function () {
    it("should return origin", async function () {
      when(mockRequest.origin).thenReturn("http://127.0.0.1");
      expect(contextTarget.origin).to.equal("http://127.0.0.1");
    });
  });

  describe("get params", function () {
    it("should return params", async function () {
      expect(contextTarget.params).to.deep.equal({});
    });
  });

  describe("get path", function () {
    it("should return path", async function () {
      when(mockRequest.path).thenReturn("/");
      expect(contextTarget.path).to.equal("/");
    });
  });

  describe("get port", function () {
    it("should return port", async function () {
      when(mockRequest.port).thenReturn(80);
      expect(contextTarget.port).to.equal(80);
    });
  });

  describe("get queries", function () {
    it("should return queries", async function () {
      when(mockRequest.queries).thenReturn({});
      expect(contextTarget.queries).to.deep.equal({});
    });
  });

  describe("get routers", function () {
    it("should return routers", async function () {
      when(mockManager.routers).thenReturn([]);
      expect(contextTarget.routers).to.deep.equal([]);
    });
  });

  describe("get scheme", function () {
    it("should return scheme", async function () {
      when(mockRequest.scheme).thenReturn("http:");
      expect(contextTarget.scheme).to.equal("http:");
    });
  });

  describe("get services", function () {
    it("should return services", async function () {
      when(mockManager.services).thenReturn({});
      expect(contextTarget.services).to.deep.equal({});
    });
  });

  describe("#call(callable, ...args)", function () {
    it("should return result", async function () {
      const callable: Callable = [Math, "random"];
      when(mockManager.call<boolean>(callable)).thenReturn(true);

      const result = contextTarget.call(callable);
      expect(result).to.be.true;
    });
  });

  describe("#host(origin, name)", function () {
    it("should return self", async function () {
      when(mockManager.host("http://127.0.0.1", "test")).thenReturn(manager);

      const self = contextTarget.host("http://127.0.0.1", "test");
      expect(self).to.equal(contextTarget);
    });
  });

  describe("#replyWith(statusCode, statusText)", function () {
    context("when there is statusText", function () {
      it("should return response", async function () {
        when(
          mockManager.resolve<ServiceResponseInterface>(
            ServiceResponseContract,
          ),
        ).thenReturn(response);
        when(mockResponse.setStatusCode(200)).thenReturn(response);
        when(mockResponse.setStatusText("OK")).thenReturn(response);

        const result = contextTarget.replyWith(200, "OK");
        expect(result).to.not.be.undefined;
      });
    });
    context("when there is no statusText", function () {
      it("should return response", async function () {
        when(
          mockManager.resolve<ServiceResponseInterface>(
            ServiceResponseContract,
          ),
        ).thenReturn(response);
        when(mockResponse.setStatusCode(200)).thenReturn(response);

        const result = contextTarget.replyWith(200);
        expect(result).to.not.be.undefined;
      });
    });
  });

  describe("#request(method, path, origin)", function () {
    it("should return request", async function () {
      when(mockManager.request("GET", "/", "http://127.0.01")).thenReturn(
        request,
      );

      const result = contextTarget.request("GET", "/", "http://127.0.0.1");
      expect(result).to.not.be.undefined;
    });
  });

  describe("#resolve(resolvable, ...args)", function () {
    it("should return result", async function () {
      when(mockManager.resolve<boolean>("test")).thenReturn(true);

      const result = contextTarget.resolve("test");
      expect(result).to.be.true;
    });
  });

  describe("#router(name)", function () {
    it("should return router", async function () {
      when(mockManager.router("router")).thenReturn(router);

      const result = contextTarget.router("router");
      expect(result).to.not.be.undefined;
    });
  });

  describe("#service(origin)", function () {
    it("should return service", async function () {
      when(mockManager.service("http://127.0.0.1")).thenReturn(router);

      const result = contextTarget.service("http://127.0.0.1");
      expect(result).to.not.be.undefined;
    });
  });

  describe("#unhost(origin)", function () {
    it("should return self", async function () {
      when(mockManager.unhost("http://127.0.0.1")).thenReturn(manager);

      const self = contextTarget.unhost("http://127.0.0.1");
      expect(self).to.equal(contextTarget);
    });
  });
});
