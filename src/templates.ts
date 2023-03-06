export default [
	{ name: "config", token: "++", template: "{'#NAME#' | config#PARAMS#}" },
	{ name: "placeholder", token: "+", template: "{$_pls['#NAME#']#PARAMS#}" },
	{ name: "url", token: "~", template: "{'#NAME#' | url#PARAMS#}" },
	{ name: "chunk", token: "$", template: "{'#NAME#' | chunk#PARAMS#}" },
	{ name: "lexicon", token: "%", template: "{'#NAME#' | lexicon#PARAMS#}" },
	{ name: "snippet", token: false, template: "{'#NAME#' | snippet#PARAMS#}" },
	{ name: "resource/tv", token: "*", template: "{$_modx->resource.#NAME##PARAMS#}" },
	{ name: "comment", token: "-", template: "{*#NAME##PARAMS#*}" },
];
