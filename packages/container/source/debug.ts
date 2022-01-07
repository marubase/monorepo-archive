import { Container } from "./container.js";

const container = new Container();
container.bind("constant").toConstant("constant");
container.bind("date").toClass(Date).setScope("singleton");
container
  .bind("random")
  .toFunction(() => Math.random())
  .setScope("container");
container.bind("time").toAlias("date");
container
  .bind("log")
  .toFunction(console.log.bind(console))
  .setDependencies(["date", "date", "random", "random"]);

debugger;
