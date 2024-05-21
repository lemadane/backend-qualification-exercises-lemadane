export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Buffer
  | Map<unknown, unknown>
  | Set<unknown>
  | Array<Value>
  | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  switch (typeof value) {
    case "undefined":
    case "boolean":
    case "number":
    case "string":
      return value;
    case "object":
      if (value === null) {
        return value;
      }
      if (value instanceof Array) {
        return value.map(serialize);
      }
      if (value instanceof Buffer) {
        return {
          __t: "Buffer",
          __v: Array.from(value),
        };
      }
      if (value instanceof Date) {
        return {
          __t: "Date",
          __v: value.getTime(),
        };
      }
      if (value instanceof Map) {
        const arr: any[] = [];
        value.forEach((val, key) => {
          arr.push([serialize(key as Value), serialize(val as Value)]);
        });
        return {
          __t: "Map",
          __v: arr,
        };
      }
      if (value instanceof Set) {
        return {
          __t: "Set",
          __v: Array.from(value).map(serialize),
        };
      }
      if (value instanceof Object) {
        const obj: any = {};
        for (const key in value) {
          obj[key] = serialize(value[key]);
        }
        return obj;
      }
    default:
      throw new TypeError("Unsupported type");
  }
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize(input: any): Value {
  switch (typeof input) {
    case "undefined":
    case "boolean":
    case "number":
    case "string":
      return input;
    case "object":
      if (input === null) {
        return input;
      }
      if (Array.isArray(input)) {
        return input.map(deserialize);
      }
      if ("__t" in input && "__v" in input) {
        switch (input.__t) {
          case "Buffer":
            return Buffer.from(input.__v);
          case "Date":
            return new Date(input.__v);
          case "Map":
            const map = new Map();
            for (const [key, val] of input.__v) {
              map.set(deserialize(key), deserialize(val));
            }
            return map;
          case "Set":
            return new Set(input.__v.map(deserialize));
          default:
            throw new TypeError("Unsupported type");
        }
      }
      const obj: any = {};
      for (const key in input) {
        obj[key] = deserialize(input[key]);
      }
      return obj;
  }
}
