export default (input: string) => {
	let out = input;

	// [[-комментарий]]
	out = out.replace(/\[\[\-(.*?)\]\]/g, "{*$1*}");

	// [[~URL]]
	out = out.replace(/\[\[\~([0-9]+)\]\]/g, "{$1 | url}");

	// [[%язык]]
	out = out.replace(/\[\[\%([a-zA-Z0-9\._]+)\]\]/g, "{'$1' | lexicon}");

	// [[++системная_настройка]]
	out = out.replace(/\[\[\+\+([a-zA-Z0-9\._]+)\]\]/g, "{'$1' | config}");

	// [[+плейс.холдер]]
	out = out.replace(/\[\[(\!)?\+([a-zA-Z0-9\._]+\.[a-zA-Z0-9\._]+)\]\]/g, "{$_pls['$2']}");

	// [[+плейсхолдер]]
	out = out.replace(/\[\[(\!)?\+([a-zA-Z0-9\._]+)\]\]/g, "{$$$2}");

	// [[*поле_ресурса]]
	out = out.replace(/\[\[\*([a-zA-Z0-9\._]+)\]\]/g, "{$_modx->resource.$1}");

	// [[$чанк]]
	out = out.replace(/\[\[\$([a-zA-Z0-9\._]+)\]\]/g, "{'$1' | chunk}");
	out = out.replace(/\[\[\$([a-zA-Z0-9\._]+)\?/g, "{'$1' | chunk : [");

	// [[сниппет]]
	out = out.replace(/\[\[(\!)?([a-zA-Z0-9\._]+)\]\]/g, "{'$1$2' | snippet}");
	out = out.replace(/\[\[(\!)?([a-zA-Z0-9\._]+)\?/g, "{'$1$2' | snippet : [");

	// &параметр=`значение`
	out = out.replace(/\&([a-zA-Z0-9\._]+)=`?([^\[\]\&]+)`/g, "'$1' => '$2',");
	out = out.replace(/=> '`'/g, "=> ''");
	out = out.replace(/\',([\r\n\s\t]+)?\]\]/g, "' $1]}");

	// => '123' - значения с цифрами
	out = out.replace(/'(\d+)'/g, "$1");

	return out;
};
