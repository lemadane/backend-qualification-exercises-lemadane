import crypto from "crypto";
import { inc } from "ramda"

export class ObjectId {
  static readonly TYPE_SIZE = 1;
  static readonly TIMESTAMP_SIZE = 6;
  static readonly RANDOM_SIZE = 4;
  static readonly COUNTER_SIZE = 3;
  static readonly TOTAL_SIZE =
    ObjectId.TYPE_SIZE +
    ObjectId.TIMESTAMP_SIZE +
    ObjectId.RANDOM_SIZE +
    ObjectId.COUNTER_SIZE;

  private static random: number = Math.floor(Math.random() * 0xff_ff_ff) & 0xff_ff_ff;

  private static counter: number = ObjectId.random;

  private data: Buffer;

  constructor(
    readonly objectType: number = 0,
    readonly timestamp: number = Date.now()
  ) {
    const typeBuffer = Buffer.alloc(ObjectId.TYPE_SIZE);
    typeBuffer.writeUIntBE(objectType, 0, ObjectId.TYPE_SIZE);
    const timestampBuffer = Buffer.alloc(ObjectId.TIMESTAMP_SIZE);
    timestampBuffer.writeUIntBE(timestamp, 0, ObjectId.TIMESTAMP_SIZE);
    const randomBuffer = Buffer.alloc(ObjectId.RANDOM_SIZE);
    randomBuffer.writeUIntBE(ObjectId.random, 0, ObjectId.RANDOM_SIZE);
    ObjectId.incrementCounter();
    const counterBuffer = Buffer.alloc(ObjectId.COUNTER_SIZE);
    counterBuffer.writeUIntBE(ObjectId.counter, 0, ObjectId.COUNTER_SIZE);
    this.data = Buffer.concat([
      typeBuffer,
      timestampBuffer,
      randomBuffer,
      counterBuffer,
    ]);
  }

  static incrementCounter() {
    ObjectId.counter = (ObjectId.counter + 1) & 0xff_ff_ff;
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type);
  }

  toString(encoding?: "hex" | "base64"): string {
    return this.data.toString(encoding ?? "hex");
  }

  static fromString(str: string, encoding?: "hex" | "base64"): ObjectId {
    const data = Buffer.from(str, encoding ?? "hex");
    const objectType = data.readUIntLE(0, ObjectId.TYPE_SIZE);
    const timestamp = data.readUIntLE(
      ObjectId.TYPE_SIZE,
      ObjectId.TIMESTAMP_SIZE
    );
    return new ObjectId(objectType, timestamp);
  }

  static compare(one: ObjectId, two: ObjectId): number {
    return one.toString().localeCompare(two.toString());
  }

  static isValid(str: string, encoding?: "hex" | "base64"): boolean {
    try {
      ObjectId.fromString(str, encoding);
      return true;
    } catch {
      return false;
    }
  }

  static getTimestamp(str: string, encoding?: "hex" | "base64"): number {
    return ObjectId.fromString(str, encoding).timestamp;
  }

  static getCounter(str: string, encoding?: "hex" | "base64"): number {
    return ObjectId.fromString(str, encoding).data.readUIntLE(
      ObjectId.TYPE_SIZE + ObjectId.TIMESTAMP_SIZE + ObjectId.RANDOM_SIZE,
      ObjectId.COUNTER_SIZE
    );
  }
}
// const log = console.log
// let id = ObjectId.generate(1)
// log({ id });
// const idString = id.toString();
// log({ idString });
// const id1 = ObjectId.fromString(idString);
// log({ id1 });

