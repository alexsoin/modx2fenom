type ReplacementRule = {
	regex: RegExp;
	replace: string | ((substring: string, ...args: any[]) => string);
};

const rules: ReplacementRule[] = [
	// [[-comment]] -> {*comment*}
	{ regex: /\[\[\-(.*?)\]\]/g, replace: "{*$1*}" },

	// [[~URL]] -> {URL | url}
	{ regex: /\[\[\~([0-9]+)\]\]/g, replace: "{$1 | url}" },

	// [[%lexicon]] -> {'lexicon' | lexicon}
	{ regex: /\[\[\%([a-zA-Z0-9\._]+)\]\]/g, replace: "{'$1' | lexicon}" },

	// [[++system_setting]] -> {'system_setting' | config}
	{ regex: /\[\[\+\+([a-zA-Z0-9\._]+)\]\]/g, replace: "{'$1' | config}" },

	// [[+placeholder.key]] -> {$_pls['placeholder.key']}
	{ regex: /\[\[(\!)?\+([a-zA-Z0-9\._]+\.[a-zA-Z0-9\._]+)\]\]/g, replace: "{$_pls['$2']}" },

	// [[+placeholder]] -> {$placeholder}
	{ regex: /\[\[(\!)?\+([a-zA-Z0-9\._]+)\]\]/g, replace: "{$$$2}" },

	// [[*resource_field]] -> {$_modx->resource.resource_field}
	{ regex: /\[\[\*([a-zA-Z0-9\._]+)\]\]/g, replace: "{$_modx->resource.$1}" },

	// [[$chunk]] -> {'chunk' | chunk}
	{ regex: /\[\[\$([a-zA-Z0-9\._]+)\]\]/g, replace: "{'$1' | chunk}" },

	// [[$chunk?]] -> {'chunk' | chunk : [
	{ regex: /\[\[\$([a-zA-Z0-9\._]+)\?/g, replace: "{'$1' | chunk : [" },

	// [[snippet]] -> {'snippet' | snippet}
	// Changed to single quotes for consistency with other tags
	{ regex: /\[\[(\!)?([a-zA-Z0-9\._]+)\]\]/g, replace: "{'$1$2' | snippet}" },

	// [[#id.field]] -> {'id' | resource: 'field'}
	{ regex: /\[\[\#([0-9]+)\.([a-zA-Z0-9\._]+)\]\]/g, replace: "{'$1' | resource: '$2'}" },

	// [[snippet?]] -> {'snippet' | snippet : [
	// Changed to single quotes for consistency
	{ regex: /\[\[(\!)?([a-zA-Z0-9\._]+)\?/g, replace: "{'$1$2' | snippet : [" },

	// &param=`value` -> 'param' => 'value',
	{ regex: /\&([a-zA-Z0-9\._]+)=`?([^\[\]\&]+)`/g, replace: "'$1' => '$2'," },

	// => '`' -> => ''
	{ regex: /=> '`'/g, replace: "=> ''" },

	// Closing brackets handling: ',]] -> ' ]}
	{ regex: /\',([\r\n\s\t]+)?\]\]/g, replace: "' $1]}" },

	// Clean up numeric strings: '123' -> 123
	{ regex: /'(\d+)'/g, replace: "$1" }
];

export default (input: string) => {
	let output = input;

	// Special handling to fix the snippet regex overlap 
	// The original snippet regex was: /\[\[(\!)?([a-zA-Z0-9\._]+)\]\]/g -> '{"$1$2" | snippet}'
	// I changed it to single quotes above: "{'$1$2' | snippet}"
	// But wait, $1 is the exclamation mark. "$1$2" concatenates them.
	// simpler: regex: /\[\[(\!)?([a-zA-Z0-9\._]+)\]\]/g, replace: (match, p1, p2) => `{'${p1 || ''}${p2}' | snippet}`

	// Let's stick closer to the original logic but structured, then refine.

	return rules.reduce((acc, rule) => {
		// @ts-ignore - TS doesn't like mixing string and callback replacements easily without overload matching
		return acc.replace(rule.regex, rule.replace);
	}, output);
};
