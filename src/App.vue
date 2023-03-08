<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import useHotkey, { HotKey } from "vue3-hotkey";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import templates from "@/templates";
import ZencodLink from "@/components/ZencodLink.vue";
import { TagFenom } from "@/types";
import InputModx from "@/components/InputModx.vue";
import OutputFenom from "@/components/OutputFenom.vue";
import VDebug from "@/components/VDebug.vue";
import VLang from "@/components/VLang.vue";
import langs from "@/lang";

Notify.init({ position: "center-top" });

const langNow = ref<"ru"|"en">("ru");
const lang = computed(() => langs[langNow.value] || langs.ru);
const inputTag = ref("");
const showDebug = ref(false);
const tag = reactive<TagFenom>({
	nameTag: "",
	nameTagPre: "",
	modifierTag: "",
	propertyTag: "",
	flagTag: "",
	tokenTag: "",
	isLetterTag: false,
	templateTag: false,
	nameNow: "",
	paramsTag: "",
	resultParams: "",
	result: "",
});
const errors = ref<Array<string>>([]);
const infos = ref<Array<string>>([]);

const hotkeys = ref<HotKey[]>([
	{
		keys: ["ctrl", "d"],
		preventDefault: true,
		handler() {
			showDebug.value = !showDebug.value;
		}
	},
]);
useHotkey(hotkeys.value);

const setArgs = (str: string, args: Array<string>) => str.replace(/{(\d+)}/g, (match: string, number: number) => typeof args[number] !== "undefined" ? args[number] : match);

const clearAll = () => {
	errors.value = [];
	infos.value = [];

	tag.nameTag = "";
	tag.nameTagPre = "";
	tag.modifierTag = "";
	tag.propertyTag = "";
	tag.flagTag = "";
	tag.tokenTag = "";
	tag.isLetterTag = false;
	tag.templateTag = false;
	tag.nameNow = "";
	tag.paramsTag = "";
	tag.resultParams = "";
	tag.result = "";
};

const getMatch = (str: string, reg: RegExp) => Array.from(str.matchAll(reg))[0] || [];

const convertTag = () => {
	const baseMatch = getMatch(inputTag.value, /[\[]{2}(([!])?.*)[\]]{2}/sg);
	clearAll();

	if(baseMatch.length === 0) {
		tag.result = lang.value.error.undefinedValue;
		return;
	}

	const [ nameTagPre, paramsTag ] = baseMatch[1].split("?");
	const modifierTag = nameTagPre.indexOf(":") >= 0 && nameTagPre.substring(nameTagPre.indexOf(":") + 1) || "";
	const propertyTag = nameTagPre.indexOf("@") >= 0 && nameTagPre.replace(`:${modifierTag}`, "").substring(nameTagPre.replace(`:${modifierTag}`, "").indexOf("@") + 1) || "";

	const nameTag = nameTagPre.replace(`:${modifierTag}`, "").replace(`@${propertyTag}`, "").trim();

	if(modifierTag) {
		modifierTag.split(":").forEach(modifier => {
			const modifierInfo = lang.value.info.modifier.find(i => modifier.indexOf(i.name) >= 0);

			if(modifierInfo) {
				infos.value.push(modifierInfo.message);
			}

			errors.value.push(setArgs(lang.value.error.modifier, [modifier.trim()]));
		});
	}

	if(propertyTag) {
		errors.value.push(setArgs(lang.value.error.property, [propertyTag.trim()]));
	}

	const [ tokenTag, flagTag ] = getMatch(nameTag, /([!])?([-*$~%!]?|[+]{1,2})?/g);

	const isLetterTag = getMatch(nameTag.replace(tokenTag, ""), /^[a-zA-Z]/gu).length > 0;
	const templateTag = templates.find(i => i.token === tokenTag) || (isLetterTag && templates.find(i => i.name === "snippet") );
	const nameNow = nameTag.replace(tokenTag, "");

	let resultParams = "";

	if(paramsTag) {
		const params = Array.from(paramsTag.matchAll(/(&(.*?)[ ]{0,}=[ ]{0,}`(.*?)`)/sg))
			.map(i => ({ name: i[2], value: i[3] }))
			.filter(i => i.name);

		const strParams = params
			.map(i => `'${i.name}' => '${i.value || ""}'`)
			.filter(i => i)
			.join(",\n\t") || "";

		if(strParams) {
			resultParams = ` : [\n\t${strParams}\n]`;
		}
	}

	const result = templateTag && templateTag.template.replaceAll("#NAME#", `${flagTag || ""}${nameNow}`).replaceAll("#PARAMS#", resultParams || "") || lang.value.error.error;

	tag.nameTag = nameTag;
	tag.nameTagPre = nameTagPre;
	tag.modifierTag = modifierTag;
	tag.propertyTag = propertyTag;
	tag.flagTag = flagTag;
	tag.tokenTag = tokenTag;
	tag.isLetterTag = isLetterTag;
	tag.templateTag = templateTag;
	tag.nameNow = nameNow;
	tag.paramsTag = paramsTag;
	tag.resultParams = resultParams;
	tag.result = result;

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
				<output-fenom :fenom-out="tag" />
			</div>
		</div>
		<div
			v-if="infos.length > 0"
			class="mt-2 bg-green-500 p-2 rounded flex flex-col gap-2 content-links text-sm"
		>
			<div
				v-for="info in infos"
				:key="info"
				class="bg-green-400 px-4 py-2 rounded"
				v-html="info"
			/>
		</div>
		<div
			v-if="errors.length > 0"
			class="mt-2 bg-red-500 p-2 text-white rounded flex flex-col gap-2 content-links text-sm"
		>
			<div
				v-for="error in errors"
				:key="error"
				class="bg-red-400 px-4 py-2 rounded"
				v-html="error"
			/>
		</div>
		<v-debug
			v-if="showDebug"
			v-model:inputTag="inputTag"
			:tag="tag"
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
