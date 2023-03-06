export default [
	{
		name: "set",
		events: [
			{ name: "config", cell: "", value: "[[++configTest]]" },
			{ name: "placeholder", cell: "", value: "[[+placeholderTest]]" },
			{ name: "url", cell: "", value: "[[~urlTest]]" },
			{ name: "chunk", cell: "", value: "[[$chunkTest]]" },
			{ name: "lexicon", cell: "", value: "[[%lexiconTest]]" },
			{ name: "snippet", cell: "", value: "[[snippetTest]]" },
			{ name: "!snippet", cell: "", value: "[[!snippetTest]]" },
			{ name: "resource", cell: "", value: "[[*resource]]" },
		]
	},
	{
		name: "add",
		events: [
			{ name: "+ @priset", cell: "]]", value: "@priset]]" },
			{ name: "+ :modifier", cell: "]]", value: ":default:modName]]" },
			{ name: "+ -comment", cell: "[[", value: "[[-" },
			{ name: "+ ?params", cell: "]]", value: "? &param=`value`]]" },
		]
	},
	{
		name: "combo",
		events: [
			{ name: "combo-tag #1", cell: "", value: `[[!MySnippet@myPropSet:filter1:default=\`test123\`? &prop1=\`x\` &prop2=\`y\`]]` },
			{ name: "combo-tag #2", cell: "", value: `[[!MySnippet@myPropSet:default=\`test123\`?\n\t&prop1=\`x\`\n\t&prop2=\`y\`\n\t&clearProp1=\`\`\n\t&clearProp2=\`\`\n]]` },
		]
	},
];
