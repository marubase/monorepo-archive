import { ContainerContext } from "./container.js";
import {
  RegistryContract,
  RegistryKey,
  RegistryTag,
  RegistryTags,
  Resolvable,
} from "./registry.js";

export interface ResolverContract {
  readonly dependencies: Resolvable[];

  readonly key?: RegistryKey;

  readonly registry: RegistryContract;

  readonly tags: RegistryTags;

  clearDependencies(): this;

  clearKey(): this;

  clearTag(tag: RegistryTag): this;

  clearTags(): this;

  resolve<Result>(context: ContainerContext, ...args: unknown[]): Result;

  resolveDependencies(context: ContainerContext): unknown[];

  setDependencies(dependencies: Resolvable[]): this;

  setKey(key: RegistryKey): this;

  setTag(tag: RegistryTag): this;

  setTags(tags: RegistryTags): this;
}
