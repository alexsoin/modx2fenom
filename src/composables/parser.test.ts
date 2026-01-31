import { describe, expect, test } from "bun:test";
import { parseTag } from "./parser";
import langs from "../data/lang";

const lang = langs.ru;

describe("Parser", () => {
    test("parses snippet call", () => {
        const input = "[[!pdoResources? &parents=`1`]]";
        const result = parseTag(input, lang);

        expect(result.name).toBe("pdoResources");
        expect(result.fenom?.flagNoCache).toBe("!");
        expect(result.params).toHaveLength(1);
        expect(result.params[0].name).toBe("parents");
        expect(result.params[0].value).toBe("1");
        // We rely on converter for the final string, but let's check it roughly
        expect(result.out).toContain("pdoResources");
    });

    test("parses system setting", () => {
        const input = "[[++site_name]]";
        const result = parseTag(input, lang);

        expect(result.name).toBe("site_name");
        expect(result.modx?.key).toBe("++");
        expect(result.out).toContain("site_name");
        expect(result.out).toContain("config");
    });

    test("handles invalid input", () => {
        const input = "invalid";
        const result = parseTag(input, lang);
        expect(result.out).toBe(lang.error.undefinedValue);
    });
});
