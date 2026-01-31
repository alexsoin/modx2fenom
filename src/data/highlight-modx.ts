/*
Language: MODX
Requires: xml.js
Author: Custom for Modx2Fenom
*/

export default function (hljs: any) {
    return {
        name: 'MODX',
        case_insensitive: true,
        contains: [
            {
                className: 'template-tag',
                begin: /\[\[/, end: /\]\]/,
                contains: [
                    {
                        className: 'symbol',
                        begin: /!|\+\+|[+*$%~#]/
                    },
                    {
                        className: 'name',
                        begin: /[a-zA-Z0-9_.-]+/,
                        relevance: 0
                    },
                    {
                        className: 'params',
                        begin: /\?/, end: /(?=\]\])/,
                        contains: [
                            {
                                className: 'attr',
                                begin: /&[a-zA-Z0-9_.-]+/,
                            },
                            {
                                className: 'operator',
                                begin: /=/
                            },
                            {
                                className: 'string',
                                begin: /`/, end: /`/,
                                contains: [
                                    {
                                        // Recursive match for nested tags
                                        begin: /\[\[/, end: /\]\]/,
                                        subLanguage: 'MODX'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
}
