import { BindingTag, Resolvable } from "./contracts/registry.contract.js";
import { ResolverScope } from "./contracts/resolver.contract.js";
import {
  getResolverDependencies,
  getResolverTags,
  setResolvable,
  setResolverDependencies,
  setResolverScope,
  setResolverTags,
} from "./metadata.js";

export function resolvable(
  scope: ResolverScope = "transient",
): ClassDecorator & MethodDecorator {
  return (target: Function | Object, property?: string | symbol): void => {
    setResolvable(target, property);
    setResolverScope(scope, target, property);
  };
}

export function inject(dependency: Resolvable): ParameterDecorator {
  return (target, property, index) => {
    const dependencies = getResolverDependencies(target, property);
    dependencies[index] = dependency;
    setResolverDependencies(dependencies, target, property);
  };
}

export function tag(tag: BindingTag): ClassDecorator & MethodDecorator {
  return (target: Function | Object, property?: string | symbol): void => {
    const tags = getResolverTags(target, property).add(tag);
    setResolverTags(tags, target, property);
  };
}
