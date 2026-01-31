import templates from "@/data/templates";
import converter from "@/composables/converter";
import { DataFenom } from "@/data/types";
import langs from "@/data/lang";

const getMatch = (str: string, reg: RegExp) => Array.from(str.trim().replace(/[\r\n\t]+/g, "").matchAll(reg))[0] || [];

export const parseTag = (inputTag: string, lang: any): DataFenom => {
    const dataFenom: DataFenom = {
        raw: "",
        out: "",
        name: "",
        modifier: "",
        property: "",
        params: [],
        fenom: null,
        modx: null,
    };

    const [tagRaw, tagContent, flagNoCache] = getMatch(inputTag, /^[\[]{2}(([!])?.*)[\]]{2}$/sg);

    if (!tagContent) {
        dataFenom.out = lang.error.undefinedValue;
        return dataFenom;
    }

    const [preParams, rawParams] = tagContent.split("?");
    const [, modxTagKey, tagName, tagProperty, tagModifiers] = getMatch(preParams, /[!]?([-*$~%]?|[+]{1,2})?([-_a-zA-Z0-9\\.]*)(@[-_a-zA-Z0-9\\.]*)?(:.*)?/gs);

    const templateTag = templates.find(i => i.token === modxTagKey) || (!!tagName && templates.find(i => i.name === "snippet"));

    const paramsArr = (rawParams || "").trim().replace(/\s+/g, " ").replace(/`[\s]+&/g, "`&").replace(/[\s]?=[\s]?`/g, "=`").split("&")
        .map(i => i.split(/([^=\s]+)=`(.*)`$/g))
        .map(i => ({ name: i[1], value: i[2]?.trim() }))
        .filter(i => i.name) || [];

    const paramsFenom = paramsArr
        .map((i) => `'${i.name}' => '${i.value || ""}'`)
        .join(",\n\t");

    const paramsFenomOut = paramsFenom ? ` : [\n\t${paramsFenom}\n]` : "";

    const result = templateTag
        ? templateTag.template
            .replaceAll("#NAME#", `${flagNoCache || ""}${tagName}`)
            .replaceAll("#PARAMS#", paramsFenomOut || "")
        : null;

    dataFenom.raw = tagRaw;
    dataFenom.out = converter(result || inputTag); // Use parser logic for structure but existing converter for text
    dataFenom.name = tagName;
    dataFenom.modifier = tagModifiers || "";
    dataFenom.property = tagProperty || "";
    dataFenom.params = paramsArr;

    // Converter logic in App.vue also called converter(result || inputTag.value)
    // However, the new converter handles full tags nicely.
    // The legacy logic constructing `result` manually seems slightly redundant if we trust `converter.ts` fully,
    // but `converter.ts` was refactored to support exactly what `result` was producing?
    // Actually, `converter.ts` (new version) takes raw input and transforms it using rules.
    // The code in App.vue was manually constructing Fenom syntax from pieces.
    // Let's defer to `converter.ts` for the main transformation if possible, or keep this hybrid approach if `converter.ts` expects raw MODX tags.
    // Since `converter.ts` rules expect raw MODX tags like `[[...]]`, passing it `result` (which is ALREADY Fenom syntax from templates) might be wrong if `converter` applies rules blindly.
    // BUT `converter.ts` rules operate on `[[...]]`. If `result` is `{...}`, `converter` won't touch it.
    // So it's safe.

    dataFenom.fenom = {
        flagNoCache: flagNoCache,
        template: templateTag || undefined,
    };
    dataFenom.modx = {
        key: modxTagKey,
        params: rawParams,
    };

    return dataFenom;
};
