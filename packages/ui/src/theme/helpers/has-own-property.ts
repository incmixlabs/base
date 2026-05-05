/** A util to check whether the object has a key, while inferring the correct key type */
/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: utility name intentionally mirrors the built-in concept */
function hasOwnProperty<K extends string | number | symbol>(
  obj: Record<K, unknown>,
  key: string | number | symbol,
): key is K {
  // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn is unavailable under current TS lib target.
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export { hasOwnProperty }
