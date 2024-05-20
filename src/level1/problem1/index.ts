import crypto from "crypto";

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
export function serialize(input) {
  let result = undefined;
  switch (typeof input) {
    case "string":
      result = { type: "string", value: input };
      break;
    case "number":
      result = { type: "number", value: input };
      break;
    case "boolean":
      result = { type: "boolean", value: input };
      break;
    case "undefined":
      result = { type: "undefined", value: undefined };
      break;
    case "object":
      if (input === null) {
        result = { type: "object", value: input };
        break;
      }
      if (input instanceof Date) {
        result = {
          type: "date",
          value: input,
        };
        break;
      }
      if (input instanceof Array) {
        result = { type: "array", value: [] };
        input.forEach((val, index) => {
          result.value[index] = JSON.parse(serialize(val));
        });
        break;
      }
      if (input instanceof Set) {
        result = { type: "set", value: [] };
        const array = Array.from(input);
        array.forEach((val, index) => {
          result.value[index] = JSON.parse(serialize(val));
        });
        break;
      }
      if (input instanceof Buffer) {
        result = {
          type: "buffer",
          value: Array.from(input),
        };
        break;
      }
      if (input instanceof Map) {
        result = { type: "map", value: [] };
        Array.from(input.keys()).forEach((keyItem) => {
          const key = JSON.parse(serialize(keyItem));
          const value = JSON.parse(serialize(input.get(keyItem)));
          result.value.push({ key, value });
        });
        break;
      }
      if (Object.keys(input).length > 0) {
        result = { type: "object", value: {} };
        Object.keys(input).forEach((key) => {
          result.value[key] = JSON.parse(serialize(input[key]));
        });
        break;
      }
      if (Object.keys(input).length === 0) {
        result = { type: "object", value: input };
        break;
      }
      break;
    default:
      throw new TypeError(
        `Unsupported type for serialization: ${typeof input}`
      );
  }
  return JSON.stringify(result);
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize(input) {
  const obj = JSON.parse(input);
  switch (obj["type"]) {
    case "string":
      return obj.value;
    case "number":
      return obj.value;
    case "boolean":
      return obj.value;
    case "undefined":
      return undefined;
    case "date":
      return new Date(obj.value);
    case "array":
      return Object.keys(obj.value).map((key) =>
        deserialize(JSON.stringify(obj.value[key]))
      );
    case "set":
      return new Set(
        Object.keys(obj.value).map((key) =>
          deserialize(JSON.stringify(obj.value[key]))
        )
      );
    case "buffer":
      return Buffer.from(obj.value);

    case "map":
      const map = new Map();
      obj.value.forEach((item, i) => {
        const key = deserialize(JSON.stringify(item.key));
        const value = deserialize(JSON.stringify(item.value));
        map.set(key, value);
      });
      return map;
    case "object":
      if (obj.value === null) {
        return null;
      }
      return Object.keys(obj.value).reduce((acc, key) => {
        acc[key] = deserialize(JSON.stringify(obj.value[key]));
        return acc;
      }, {});

    default:
      throw new TypeError(`Unsupported type for deserialization: ${obj.type}`);
  }
}

// const buffer = crypto.randomBytes(4);
// console.log({ buffer });
// const serializedBuffer = serialize(buffer);
// console.log({ serializedData: serializedBuffer });
// const deserializedBuffer = deserialize(serializedBuffer);
// console.log({ deserializedBuffer });

// const set = new Set([
//   undefined,
//   null,
//   { type: "number", value: 10 },
//   {},
//   [4, 5],
//   [4, 5],
//   "hello",
// ]);
// console.log({ set });
// const serializedSet = serialize(set);
// console.log({ serializedSet });
// const deserializedSet = deserialize(serializedSet);
// console.log({ deserializedSet });

// const set1 = new Set(["one", "two", "three"]);
// console.log({ set1 });
// const serializedSet1 = serialize(set1);
// console.log({ serializedSet1 });
// const deserializedSet1 = deserialize(serializedSet1);
// console.log({ deserializedSet1 });

// const map = new Map();
// map.set(undefined, set1);
// map.set(8, 9);
// const serializedMap = serialize(map);
// console.log({ serializedMap });
// const deserializedMap = deserialize(serializedMap);
// console.log({ deserializedMap });
// console.log(deserializedMap.get(undefined))

// const serializedEmpty = serialize({});
// console.log({ serializedEmpty });
// const deserializedEmpty = deserialize(serializedEmpty);
// console.log({ deserializedEmpty });

// const serializedNull = serialize(null);
// console.log({ serializedNull });
// const deserializedNull = deserialize(serializedNull);
// console.log({ deserializedNull });

// const map1 = new Map([
//   ["one", 1],
//   ["two", 2],
// ])
// const serializedMap1 = serialize(map1);
// console.log({ serializedMap1 });
// const deserializedMap1 = deserialize(serializedMap1);
// console.log({ deserializedMap1 });

// const array = [1, 2, 3, 4, 'lem'];
// const serializedArray = serialize(array);
// console.log({ serializedArray });
// const deserializedArray = deserialize(serializedArray);
// console.log({ deserializedArray });

// const set2 = new Set([1, 2, 3, 4, 'lem']);
// const serializedSet2 = serialize(set2);
// console.log({ serializedSet2 });
// const deserializedSet2 = deserialize(serializedSet2);
// console.log({ deserializedSet2 });

// const buffer1 = Buffer.from([90, 115, 109, 187, 242, 216, 94, 110])
// console.log({ buffer1 });
// const serializedBuffer1 = serialize(buffer1);
// console.log({ serializedBuffer1 });
// const deserializedBuffer1 = deserialize(serializedBuffer1);
// console.log({ deserializedBuffer1 });

// const date1 = new Date("2022-12-25T04:27:49.988Z")
// console.log({ date1 });
// const serializedDate1 = serialize(date1);
// console.log({ serializedDate1 });
// const deserializedDate1 = deserialize(serializedDate1);
// console.log({ deserializedDate1 });

// const nestedObject = {
//   null: null,
//   string: "string",
//   number: 1,
//   boolean: true,
//   undefined: undefined,
//   Date: new Date("2022-12-25T04:27:49.988Z"),
//   Buffer: Buffer.from([90, 115, 109, 187, 242, 216, 94, 110]),
//   Set: new Set(["one", "two", "three"]),
//   Map: new Map([
//     ["one", 1],
//     ["two", 2],
//   ]),
//   object: {
//     null: null,
//     string: "string",
//     number: 1,
//     boolean: true,
//     undefined: undefined,
//     Date: new Date("2022-12-25T04:27:49.988Z"),
//     Buffer: Buffer.from([90, 115, 109, 187, 242, 216, 94, 110]),
//     Set: new Set(["one", "two", "three"]),
//     Map: new Map([
//       ["one", 1],
//       ["two", 2],
//     ]),
//   },
//   array: [
//     null,
//     "string",
//     1,
//     true,
//     undefined,
//     new Date("2022-12-25T04:27:49.988Z"),
//     Buffer.from([90, 115, 109, 187, 242, 216, 94, 110]),
//     new Set(["one", "two", "three"]),
//     new Map([
//       ["one", 1],
//       ["two", 2],
//     ]),
//     {
//       null: null,
//       string: "string",
//       number: 1,
//       boolean: true,
//       undefined: undefined,
//     },
//   ],
// }
// console.log({ nestedObject });
// const serializedNestedObject = serialize(nestedObject);
// console.log({ serializedNestedObject });
// const deserializedNestedObject = deserialize(serializedNestedObject);
// console.log({ deserializedNestedObject });

