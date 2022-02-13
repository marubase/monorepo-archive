import { BindingTag, Resolvable } from "./contracts/registry.contract.js";
import { ResolverScope } from "./contracts/resolver.contract.js";

export function getResolverDependencies(
  target: Function | Object,
  property?: string | symbol,
): Resolvable[] {
  const metadataKey = "container:resolver:dependencies";
  return typeof property !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, property) || []
    : Reflect.getMetadata(metadataKey, target) || [];
}

export function getResolverScope(
  target: Function | Object,
  property?: string | symbol,
): ResolverScope {
  const metadataKey = "container:resolver:scope";
  return typeof property !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, property) || "transient"
    : Reflect.getMetadata(metadataKey, target) || "transient";
}

export function getResolverTags(
  target: Function | Object,
  property?: string | symbol,
): Set<BindingTag> {
  const metadataKey = "container:resolver:tags";
  return typeof property !== "undefined"
    ? Reflect.getMetadata(metadataKey, target, property) || new Set()
    : Reflect.getMetadata(metadataKey, target) || new Set();
}

export function isResolvable(
  target: Function | Object,
  property?: string | symbol,
): boolean {
  const metadataKey = "container:resolvable";
  return typeof property !== "undefined"
    ? Reflect.hasMetadata(metadataKey, target, property)
    : Reflect.hasMetadata(metadataKey, target);
}

export function setResolvable(
  target: Function | Object,
  property?: string | symbol,
): void {
  const metadataKey = "container:resolvable";
  if (typeof property !== "undefined")
    Reflect.defineMetadata(metadataKey, true, target, property);
  else Reflect.defineMetadata(metadataKey, true, target);
}

export function setResolverDependencies(
  dependencies: Resolvable[],
  target: Function | Object,
  property?: string | symbol,
): void {
  const metadataKey = "container:resolver:dependencies";
  if (typeof property !== "undefined")
    Reflect.defineMetadata(metadataKey, dependencies, target, property);
  else Reflect.defineMetadata(metadataKey, dependencies, target);
}

export function setResolverScope(
  scope: ResolverScope,
  target: Function | Object,
  property?: string | symbol,
): void {
  const metadataKey = "container:resolver:scope";
  if (typeof property !== "undefined")
    Reflect.defineMetadata(metadataKey, scope, target, property);
  else Reflect.defineMetadata(metadataKey, scope, target);
}

export function setResolverTags(
  tags: Set<BindingTag>,
  target: Function | Object,
  property?: string | symbol,
): void {
  const metadataKey = "container:resolver:tags";
  if (typeof property !== "undefined")
    Reflect.defineMetadata(metadataKey, tags, target, property);
  else Reflect.defineMetadata(metadataKey, tags, target);
}
