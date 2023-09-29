<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import useHotkey, { HotKey } from "vue3-hotkey";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import templates from "@/data/templates";
import ZencodLink from "@/components/ZencodLink.vue";
import { DataFenom } from "@/data/types";
import InputModx from "@/components/InputModx.vue";
import OutputFenom from "@/components/OutputFenom.vue";
import VDebug from "@/components/VDebug.vue";
import VLang from "@/components/VLang.vue";
import AppInfo from "@/components/AppInfo.vue";
import langs from "@/data/lang";
import converter from "@/composables/converter";

Notify.init({ position: "center-top" });

const langNow = ref<"ru"|"en">("ru");
const lang = computed(() => langs[langNow.value] || langs.ru);
const inputTag = ref("");
const showDebug = ref(false);
const dataFenom = reactive<DataFenom>({
	raw: "",
	out: "",
	name: "",
	modifier: "",
	property: "",
	params: [],
	fenom: null,
	modx: null,
});
const errors = ref<Array<string>>([]);
const infos = ref<Array<string>>([]);

const hotkeys = ref<HotKey[]>([
	{
		keys: ["ctrl", "alt", "d"],
		preventDefault: true,
		handler() {
			showDebug.value = !showDebug.value;
		}
	},
]);
useHotkey(hotkeys.value);

const clearAll = () => {
	errors.value = [];
	infos.value = [];

	dataFenom.raw = "";
	dataFenom.out = "";
	dataFenom.name = "";
	dataFenom.modifier = "";
	dataFenom.property = "";
	dataFenom.params = [];
	dataFenom.fenom = null;
	dataFenom.modx = null;
};

const getMatch = (str: string, reg: RegExp) => Array.from(str.trim().replace(/[\r\n\t]+/g, "").matchAll(reg))[0] || [];

const convertTag = () => {
	const [ tagRaw, tagContent, flagNoCache ] = getMatch(inputTag.value, /^[\[]{2}(([!])?.*)[\]]{2}$/sg);
	clearAll();

	if(!tagContent) {
		dataFenom.out = lang.value.error.undefinedValue;
		return;
	}

	const [ preParams, rawParams ] = tagContent.split("?");
	const [ , modxTagKey, tagName, tagProperty, tagModifiers ] = getMatch(preParams, /[!]?([-*$~%]?|[+]{1,2})?([-_a-zA-Z0-9\\.]*)(@[-_a-zA-Z0-9\\.]*)?(:.*)?/gs);

	const templateTag = templates.find(i => i.token === modxTagKey) || (!!tagName && templates.find(i => i.name === "snippet") );

	const paramsArr = (rawParams || "").trim().replace(/`[\s]+&/g, "`&").split("&").map(i => i.split(/([^=\s]+)=`(.*)`$/g))
		.map(i => ({ name: i[1], value: i[2] }))
		.filter(i => i.name) || [];
	const paramsFenom = paramsArr
		.map(i => `'${i.name}' => '${i.value || ""}'`)
		.join(",\n\t");
	const paramsFenomOut = paramsFenom ? ` : [\n\t${paramsFenom}\n]` : "";

	const result = templateTag
		? templateTag.template
			.replaceAll("#NAME#", `${flagNoCache || ""}${tagName}`)
			.replaceAll("#PARAMS#", paramsFenomOut || "")
		: lang.value.error.error;

	dataFenom.raw = tagRaw;
	dataFenom.out = converter(result);
	dataFenom.name = tagName;
	dataFenom.modifier = tagModifiers;
	dataFenom.property = tagProperty;
	dataFenom.params = paramsArr;
	dataFenom.fenom = {
		flagNoCache: flagNoCache,
		template: templateTag,
	};
	dataFenom.modx = {
		key: modxTagKey,
		params: rawParams,
	};

	if(!templateTag) Notify.failure(lang.value.error.emptyTemplate);
};

onMounted(() => {
	inputTag.value = "[[!pdoResources?\n\t&parents=`1`\n\t&depth=`0`\n\t&tpl=`ListRowTpl`\n\t&tplWrapper=`@INLINE [[+output]]`\n\t&includeTVs=`image`\n]]";
});

watch(inputTag, () => convertTag());
</script>

<template>
	<div class="min-h-screen max-w-5xl mx-auto flex flex-col justify-center">
		<div class="mt-8 md:mt-20 mb-14">
			<h1 class="text-4xl flex flex-row gap-3 uppercase items-center justify-center text-white select-none font-bold">
				<zencod-link />
				<span>modx → fenom</span>
			</h1>
		</div>
		<div class="flex flex-col md:flex-row gap-12 md:gap-5 py-3 w-full">
			<div class="flex-1">
				<input-modx v-model="inputTag" />
			</div>
			<div class="flex-1 relative">
				<output-fenom :fenom-out="dataFenom" />
			</div>
		</div>
		<app-info
			:property="dataFenom.property"
			:modifiers="dataFenom.modifier"
			:lang-now="langNow"
		/>
		<v-debug
			v-if="showDebug"
			v-model:inputTag="inputTag"
			:tag="dataFenom"
		/>
		<div class="flex flex-col gap-5 justify-center items-center text-blue-300 text-center mt-8 mb-20">
			<div class="">
				<div class="mb-1">
					{{ lang.desc }}
				</div>
				<v-lang v-model="langNow" />
			</div>
			<a
				href="https://github.com/alexsoin/modx2fenom"
				class="hover:opacity-90"
				target="_blank"
				title="репозиторий проекта"
			><img
				src="https://github.githubassets.com/favicons/favicon.svg"
				height="20"
				width="20"
				alt="github"
			></a>
		</div>
	</div>
</template>
