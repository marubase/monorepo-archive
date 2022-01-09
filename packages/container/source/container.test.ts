import { expect } from "chai";
import { Cache } from "./cache.js";
import { Container } from "./container.js";
import { ServiceProvider } from "./contracts/container.contract.js";
import { Resolver } from "./resolver.js";

class FullTestServiceProvider implements ServiceProvider {
  public onBoot(): Promise<void> {
    return Promise.resolve();
  }

  public onInstall(): void {
    return undefined;
  }

  public onShutdown(): Promise<void> {
    return Promise.resolve();
  }

  public onUninstall(): void {
    return undefined;
  }
}

class EmptyTestServiceProvider implements ServiceProvider {}

suite("Container", function () {
  let container: Container;
  setup(async function () {
    container = new Container();
  });

  suite("#booted", function () {
    test("should return predicate", async function () {
      expect(container.booted).to.be.false;
    });
  });

  suite("#cache", function () {
    test("should return cache", async function () {
      expect(container.cache).to.be.an.instanceOf(Cache);
    });
  });

  suite("#resolver", function () {
    test("should return resolver", async function () {
      expect(container.resolver).to.be.an.instanceOf(Resolver);
    });
  });

  suite("#services", function () {
    test("should return services", async function () {
      expect(container.services).to.deep.equal([]);
    });
  });

  suite("#bind(bindable)", function () {
    test("should return resolve binding", async function () {
      const resolveBinding = container.bind(Date);
      expect(resolveBinding).to.have.ownProperty("toAlias");
      expect(resolveBinding).to.have.ownProperty("toClass");
      expect(resolveBinding).to.have.ownProperty("toConstant");
      expect(resolveBinding).to.have.ownProperty("toFunction");
      expect(resolveBinding).to.have.ownProperty("toMethod");
      expect(resolveBinding).to.have.ownProperty("toTag");
    });
  });

  suite("#boot()", function () {
    suite("when container is booted", function () {
      test("should return promise", async function () {
        container.install("test", new EmptyTestServiceProvider());
        await container.boot();

        const promise = container.boot();
        expect(promise).to.be.an.instanceOf(Promise);
      });
    });
    suite("when container is not booted", function () {
      test("should return promise", async function () {
        container.install("test", new EmptyTestServiceProvider());

        const promise = container.boot();
        expect(promise).to.be.an.instanceOf(Promise);
      });
    });
  });

  suite("#bound(bindable)", function () {
    test("should return predicate", async function () {
      const predicate = container.bound(Date);
      expect(predicate).to.be.false;
    });
  });

  suite("#fork()", function () {
    test("should return fork", async function () {
      const fork = container.fork();
      expect(fork).to.be.an.instanceOf(Container);
    });
  });

  suite("#install(name, service)", function () {
    suite("when container is booted", function () {
      suite("and intall with full test service", function () {
        test("should return self", async function () {
          await container.boot();

          const self = container.install("test", new FullTestServiceProvider());
          expect(self).to.equal(container);
        });
      });
      suite("and intall with empty test service", function () {
        test("should return self", async function () {
          await container.boot();

          const self = container.install(
            "test",
            new EmptyTestServiceProvider(),
          );
          expect(self).to.equal(container);
        });
      });
    });
    suite("when container is not booted", function () {
      suite("and intall with full test service", function () {
        test("should return self", async function () {
          const self = container.install("test", new FullTestServiceProvider());
          expect(self).to.equal(container);
        });
      });
      suite("and intall with empty test service", function () {
        test("should return self", async function () {
          const self = container.install(
            "test",
            new EmptyTestServiceProvider(),
          );
          expect(self).to.equal(container);
        });
      });
    });
  });

  suite("#installed(name)", function () {
    test("should return predicate", async function () {
      const predicate = container.installed("test");
      expect(predicate).to.be.false;
    });
  });

  suite("#resolve(resolvable, ...args)", function () {
    test("should return instance", async function () {
      container.bind(Date).toClass(Date);

      const instance = container.resolve<Date>(Date);
      expect(instance).to.be.an.instanceOf(Date);
    });
  });

  suite("#shutdown()", function () {
    suite("when container is booted", function () {
      suite("and install with full test service", function () {
        test("should return promise", async function () {
          container.install("test", new FullTestServiceProvider());
          await container.boot();

          const promise = container.shutdown();
          expect(promise).to.be.an.instanceOf(Promise);
        });
      });
      suite("and install with empty test service", function () {
        test("should return promise", async function () {
          container.install("test", new EmptyTestServiceProvider());
          await container.boot();

          const promise = container.shutdown();
          expect(promise).to.be.an.instanceOf(Promise);
        });
      });
    });
    suite("when container is no booted", function () {
      suite("and install with full test service", function () {
        test("should return promise", async function () {
          container.install("test", new FullTestServiceProvider());

          const promise = container.shutdown();
          expect(promise).to.be.an.instanceOf(Promise);
        });
      });
      suite("and install with empty test service", function () {
        test("should return promise", async function () {
          container.install("test", new EmptyTestServiceProvider());

          const promise = container.shutdown();
          expect(promise).to.be.an.instanceOf(Promise);
        });
      });
    });
  });

  suite("#unbind(bindable)", function () {
    test("should return self", async function () {
      const self = container.unbind(Date);
      expect(self).to.equal(container);
    });
  });

  suite("#uninstall(name)", function () {
    suite("when container is booted", function () {
      suite("and install with full test service", function () {
        test("should return self", async function () {
          container.install("test", new FullTestServiceProvider());
          await container.boot();

          const self = container.uninstall("test");
          expect(self).to.equal(container);
        });
      });
      suite("and install with empty test service", function () {
        test("should return self", async function () {
          container.install("test", new EmptyTestServiceProvider());
          await container.boot();

          const self = container.uninstall("test");
          expect(self).to.equal(container);
        });
      });
      suite("and there is no service", function () {
        test("should return self", async function () {
          await container.boot();

          const self = container.uninstall("test");
          expect(self).to.equal(container);
        });
      });
    });
    suite("when container is no booted", function () {
      suite("and install with full test service", function () {
        test("should return self", async function () {
          container.install("test", new FullTestServiceProvider());

          const self = container.uninstall("test");
          expect(self).to.equal(container);
        });
      });
      suite("and install with empty test service", function () {
        test("should return self", async function () {
          container.install("test", new EmptyTestServiceProvider());

          const self = container.uninstall("test");
          expect(self).to.equal(container);
        });
      });
      suite("and there is no service", function () {
        test("should return self", async function () {
          const self = container.uninstall("test");
          expect(self).to.equal(container);
        });
      });
    });
  });
});
