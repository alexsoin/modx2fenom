/*
Language: Fenom
Requires: xml.js
Author: Custom for Modx2Fenom
*/

export default function (hljs: any) {
    return {
        name: 'Fenom',
        case_insensitive: true,
        subLanguage: 'xml',
        contains: [
            {
                className: 'template-tag',
                begin: /\{/, end: /\}/,
                colors: 'red', // Not used by hljs directly, relies on class
                contains: [
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    {
                        className: 'name',
                        begin: /[a-zA-Z0-9_]+/,
                        relevance: 0
                    },
                    {
                        className: 'variable',
                        begin: /\$_?[\w\d]+/
                    },
                    {
                        className: 'number',
                        begin: /\b\d+(\.\d+)?/
                    },
                    {
                        className: 'string',
                        begin: /'/, end: /'/
                    },
                    {
                        className: 'operator',
                        begin: /\||=>|:/
                    }
                ]
            }
        ]
    };
}
