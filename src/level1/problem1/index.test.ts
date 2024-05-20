import { serialize, deserialize, Value } from "./";

describe("Serialization", () => {
  describe("scalars", () => {
    const cases: [string, Value, unknown][] = [
      ["null", null, '{"type":"object","value":null}'],
      ["string", "string", '{"type":"string","value":"string"}'],
      ["number", 1, '{"type":"number","value":1}'],
      ["boolean", true, '{"type":"boolean","value":true}'],
      ["undefined", undefined, '{"type":"undefined"}'],
    ];
    test.each(cases)("serialize %p", async (_, input, output) => {
      expect(await serialize(input)).toEqual(output);
    });

    test.each(cases)("deserialize %p", async (_, output, input) => {
      expect(await deserialize(input)).toEqual(output);
    });
  });

  describe("built-in object types", () => {
    const cases: [string, Value, unknown][] = [
      [
        "Map",
        new Map([
          ["one", 1],
          ["two", 2],
        ]),
        '{"type":"map","value":[{"key":{"type":"string","value":"one"},"value":{"type":"number","value":1}},{"key":{"type":"string","value":"two"},"value":{"type":"number","value":2}}]}',
      ],
      [
        "Set",
        new Set(["one", "two", "three"]),
        '{"type":"set","value":[{"type":"string","value":"one"},{"type":"string","value":"two"},{"type":"string","value":"three"}]}',
      ],
      [
        "Buffer",
        Buffer.from([90, 115, 109, 187, 242, 216, 94, 110]),
        '{"type":"buffer","value":[90,115,109,187,242,216,94,110]}',
      ],
      [
        "Date",
        new Date("2022-12-25T04:27:49.988Z"),
        '{"type":"date","value":"2022-12-25T04:27:49.988Z"}',
      ],
    ];

    test.each(cases)("serialize %p", (_, input, output) => {
      expect(serialize(input)).toEqual(output);
    });

    test.each(cases)("deserialize %p", (_, output, input) => {
      expect(deserialize(input)).toEqual(output);
    });
  });

  describe("nested objects", () => {
    const cases: [Value, unknown][] = [
      [
        {
          null: null,
          string: "string",
          number: 1,
          boolean: true,
          undefined: undefined,
          Date: new Date("2022-12-25T04:27:49.988Z"),
          Buffer: Buffer.from([90, 115, 109, 187, 242, 216, 94, 110]),
          Set: new Set(["one", "two", "three"]),
          Map: new Map([
            ["one", 1],
            ["two", 2],
          ]),
          object: {
            null: null,
            string: "string",
            number: 1,
            boolean: true,
            undefined: undefined,
            Date: new Date("2022-12-25T04:27:49.988Z"),
            Buffer: Buffer.from([90, 115, 109, 187, 242, 216, 94, 110]),
            Set: new Set(["one", "two", "three"]),
            Map: new Map([
              ["one", 1],
              ["two", 2],
            ]),
          },
          array: [
            null,
            "string",
            1,
            true,
            undefined,
            new Date("2022-12-25T04:27:49.988Z"),
            Buffer.from([90, 115, 109, 187, 242, 216, 94, 110]),
            new Set(["one", "two", "three"]),
            new Map([
              ["one", 1],
              ["two", 2],
            ]),
            {
              null: null,
              string: "string",
              number: 1,
              boolean: true,
              undefined: undefined,
            },
          ],
        },
        '{"type":"object","value":{"null":{"type":"object","value":null},"string":{"type":"string","value":"string"},"number":{"type":"number","value":1},"boolean":{"type":"boolean","value":true},"undefined":{"type":"undefined"},"Date":{"type":"date","value":"2022-12-25T04:27:49.988Z"},"Buffer":{"type":"buffer","value":[90,115,109,187,242,216,94,110]},"Set":{"type":"set","value":[{"type":"string","value":"one"},{"type":"string","value":"two"},{"type":"string","value":"three"}]},"Map":{"type":"map","value":[{"key":{"type":"string","value":"one"},"value":{"type":"number","value":1}},{"key":{"type":"string","value":"two"},"value":{"type":"number","value":2}}]},"object":{"type":"object","value":{"null":{"type":"object","value":null},"string":{"type":"string","value":"string"},"number":{"type":"number","value":1},"boolean":{"type":"boolean","value":true},"undefined":{"type":"undefined"},"Date":{"type":"date","value":"2022-12-25T04:27:49.988Z"},"Buffer":{"type":"buffer","value":[90,115,109,187,242,216,94,110]},"Set":{"type":"set","value":[{"type":"string","value":"one"},{"type":"string","value":"two"},{"type":"string","value":"three"}]},"Map":{"type":"map","value":[{"key":{"type":"string","value":"one"},"value":{"type":"number","value":1}},{"key":{"type":"string","value":"two"},"value":{"type":"number","value":2}}]}}},"array":{"type":"array","value":[{"type":"object","value":null},{"type":"string","value":"string"},{"type":"number","value":1},{"type":"boolean","value":true},{"type":"undefined"},{"type":"date","value":"2022-12-25T04:27:49.988Z"},{"type":"buffer","value":[90,115,109,187,242,216,94,110]},{"type":"set","value":[{"type":"string","value":"one"},{"type":"string","value":"two"},{"type":"string","value":"three"}]},{"type":"map","value":[{"key":{"type":"string","value":"one"},"value":{"type":"number","value":1}},{"key":{"type":"string","value":"two"},"value":{"type":"number","value":2}}]},{"type":"object","value":{"null":{"type":"object","value":null},"string":{"type":"string","value":"string"},"number":{"type":"number","value":1},"boolean":{"type":"boolean","value":true},"undefined":{"type":"undefined"}}}]}}}',
      ],
    ];

    test.each(cases)("serialize nested object", (input, output) => {
      expect(serialize(input)).toEqual(output);
    });

    test.each(cases)("deserialize nested object", (output, input) => {
      expect(deserialize(input)).toEqual(output);
    });
  });
});
