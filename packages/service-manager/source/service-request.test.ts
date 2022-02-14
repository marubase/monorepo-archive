import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import { ServiceRequestDispatcher } from "./contracts/service-request.contract.js";
import { ServiceResponseInterface } from "./contracts/service-response.contract.js";
import { ServiceRequest } from "./service-request.js";

describe("ServiceRequest", function () {
  let mockDispatcher: ServiceRequestDispatcher;
  let dispatcher: ServiceRequestDispatcher;
  let request: ServiceRequest;
  beforeEach(async function () {
    mockDispatcher = mock<ServiceRequestDispatcher>();
    dispatcher = instance(mockDispatcher);
    request = new ServiceRequest(dispatcher, "GET", "/");
  });
  afterEach(async function () {
    reset(mockDispatcher);
  });

  describe("get credential", function () {
    context("when there is token", function () {
      it("should return token", async function () {
        request.setCredential("token");
        expect(request.credential).to.equal("token");
      });
    });
    context("when there is username and password", function () {
      it("should return credential", async function () {
        request.setCredential("username", "password");
        expect(request.credential).to.deep.equal(["username", "password"]);
      });
    });
    context("when there is no credential", function () {
      it("should return undefined", async function () {
        expect(request.credential).to.be.undefined;
      });
    });
  });

  describe("get hash", function () {
    it("should return hash", async function () {
      expect(request.hash).to.equal("");
    });
  });

  describe("get hostname", function () {
    it("should return hostname", async function () {
      expect(request.hostname).to.equal("127.0.0.1");
    });
  });

  describe("get method", function () {
    it("should return method", async function () {
      expect(request.method).to.equal("GET");
    });
  });

  describe("get origin", function () {
    it("should return origin", async function () {
      expect(request.origin).to.equal("http://127.0.0.1");
    });
  });

  describe("get path", function () {
    it("should return path", async function () {
      expect(request.path).to.equal("/");
    });
  });

  describe("get port", function () {
    context("when there is port", function () {
      it("should return port", async function () {
        request.setPort(5984);
        expect(request.port).to.equal(5984);
      });
    });
    context("when there is http scheme", function () {
      it("should return 80", async function () {
        request.setScheme("http:");
        expect(request.port).to.equal(80);
      });
    });
    context("when there is https scheme", function () {
      it("should return 443", async function () {
        request.setScheme("https:");
        expect(request.port).to.equal(443);
      });
    });
  });

  describe("get queries", function () {
    it("should return queries", async function () {
      request.setQuery("key", "value");
      expect(request.queries).to.deep.equal({ key: "value" });
    });
  });

  describe("get scheme", function () {
    it("should return scheme", async function () {
      expect(request.scheme).to.equal("http:");
    });
  });

  describe("#clearCredential()", function () {
    it("should return self", async function () {
      const self = request.clearCredential();
      expect(self).to.equal(request);
    });
  });

  describe("#clearHash()", function () {
    it("should return self", async function () {
      const self = request.clearHash();
      expect(self).to.equal(request);
    });
  });

  describe("#clearQueries()", function () {
    it("should return self", async function () {
      request.setQuery("key", "value");
      const self = request.clearQueries();
      expect(self).to.equal(request);
    });
  });

  describe("#clearQuery(key)", function () {
    it("should return self", async function () {
      const self = request.clearQuery("key");
      expect(self).to.equal(request);
    });
  });

  describe("#dispatch()", function () {
    it("should resolve response", async function () {
      when(mockDispatcher.dispatch(request)).thenResolve(
        true as unknown as ServiceResponseInterface,
      );

      const result = await request.dispatch();
      expect(result).to.not.be.undefined;
    });
  });

  describe("#setCredential(token)", function () {
    it("should return self", async function () {
      const self = request.setCredential("token");
      expect(self).to.equal(request);
    });
  });

  describe("#setCredential(username, password)", function () {
    it("should return self", async function () {
      const self = request.setCredential("username", "password");
      expect(self).to.equal(request);
    });
  });

  describe("#setHash(hash)", function () {
    it("should return self", async function () {
      const self = request.setHash("hash");
      expect(self).to.equal(request);
    });
  });

  describe("#setHostname(hostname)", function () {
    it("should return self", async function () {
      const self = request.setHostname("127.0.0.1");
      expect(self).to.equal(request);
    });
  });

  describe("#setMethod(method)", function () {
    it("should return self", async function () {
      const self = request.setMethod("POST");
      expect(self).to.equal(request);
    });
  });

  describe("#setOrigin(origin)", function () {
    it("should return self", async function () {
      const self = request.setOrigin("http://example.com");
      expect(self).to.equal(request);
    });
  });

  describe("#setPath(path)", function () {
    it("should return self", async function () {
      const self = request.setPath("/example");
      expect(self).to.equal(request);
    });
  });

  describe("#setPort(port)", function () {
    it("should return self", async function () {
      const self = request.setPort(5984);
      expect(self).to.equal(request);
    });
  });

  describe("#setQueries(queries)", function () {
    it("should return self", async function () {
      const self = request.setQueries({ key: "value" });
      expect(self).to.equal(request);
    });
  });

  describe("#setQuery(key, value)", function () {
    it("should return self", async function () {
      const self = request.setQuery("key", "value");
      expect(self).to.equal(request);
    });
  });

  describe("#setScheme(scheme)", function () {
    it("should return self", async function () {
      const self = request.setScheme("https:");
      expect(self).to.equal(request);
    });
  });
});
