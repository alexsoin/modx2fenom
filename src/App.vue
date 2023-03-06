<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import useHotkey, { HotKey } from "vue3-hotkey";
import useClipboard from "vue-clipboard3";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import templates from "@/templates";
import modifiersList from "@/modifiers.list";
import ZencodLink from "@/components/ZencodLink.vue";
import { TagFenom } from "./types";
import debug from "@/debug";

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

const { toClipboard } = useClipboard();

const copy = async (str: string) => {
	if(str.length === 0) return;
	try {
		await toClipboard(str);
		Notify.info(`Скопировано`);
	} catch (e) {
		console.error(e);
	}
};

const clearVal = (message: string) => {
	console.log(`clear: ${message}`);
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
	const baseMatch = getMatch(inputTag.value, /^\[\[((?:.|\n)*?)]]$/g);

	clearAll();

	if(baseMatch.length === 0) {
		Notify.warning("Не разберу, что вы ввели :(");

		return clearVal("ничего не найдено");
	}

	const [ nameTagPre, paramsTag ] = baseMatch[1].split("?");
	const modifierTag = nameTagPre.indexOf(":") >= 0 && nameTagPre.substring(nameTagPre.indexOf(":") + 1) || "";
	const propertyTag = nameTagPre.indexOf("@") >= 0 && nameTagPre.replace(`:${modifierTag}`, "").substring(nameTagPre.replace(`:${modifierTag}`, "").indexOf("@") + 1) || "";

	const nameTag = nameTagPre.replace(`:${modifierTag}`, "").replace(`@${propertyTag}`, "").trim();

	if(modifierTag) {
		modifierTag.split(":").forEach(modifier => {
			const modifierInfo = modifiersList.find(i => modifier.indexOf(i.name) >= 0);

			if(modifierInfo) {
				infos.value.push(modifierInfo.message);
			}

			errors.value.push(`В теге присутствует фильтр или модификатор <code>:${modifier.trim()}</code> для перевода его в синтаксис fenom воспользуйтесь <a href="https://docs.modx.pro/komponentyi/pdotools/parser#%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80-Fenom" target="_blank">справочником</a>`);
		});
	}

	if(propertyTag) {
		errors.value.push(`В теге присутствует набор свойств <code>@${propertyTag.trim()}</code> для перевода его в синтаксис fenom воспользуйтесь <a href="https://docs.modx.pro/komponentyi/pdotools/parser#%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80-Fenom" target="_blank">справочником</a>`);
	}

	const [ flagTag, tokenTag ] = getMatch(nameTag, /([!])?([-*$~%!]?|[+]{1,2})?/g);
	const isLetterTag = getMatch(nameTag.replace(flagTag, ""), /^[a-zA-Z]/gu).length > 0;
	const templateTag = templates.find(i => i.token === tokenTag) || (isLetterTag && templates.find(i => i.name === "snippet") );
	const nameNow = nameTag.replace(tokenTag, "");

	let resultParams = "";

	if(paramsTag) {
		const trimSymbol = "%nbsp%";
		const arrParams = paramsTag.replaceAll("\n", trimSymbol).trim().replaceAll("` &", `\`${trimSymbol}&`).split(trimSymbol);

		const strParams = arrParams.map(i => {
			const match = getMatch(i, /&(.*?)=`(.*?)?`/g);

			if(!match) return;

			const [, key, value ] = match;

			if(!key) return false;

			return `'${key}' => '${value || ""}'`;
		}).filter(i => i).join(",\n\t") || "";

		if(strParams) {
			resultParams = ` : [\n\t${strParams}\n]`;
		}
	}

	const result = templateTag && templateTag.template.replace("#NAME#", nameNow).replace("#PARAMS#", (resultParams ? ` ${resultParams}` : "")) || "Ошибка!";

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

	if(!templateTag) Notify.failure("Не найден шаблон для введенного тега");
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
				<label class="flex flex-col text-white uppercase">
					modx:
					<textarea
						v-model="inputTag"
						cols="30"
						rows="10"
						spellcheck="false"
						class="mt-2 p-2 bg-gray-600 bg-opacity-40 border-2 border-gray-200 shadow-lg text-gray-100 rounded"
					/>
				</label>
			</div>
			<div class="flex-1 relative">
				<label class="flex flex-col text-white uppercase">
					<span class="flex flex-row gap-4 justify-between items-end">
						fenom: <span
							v-if="tag.templateTag"
							class="text-xs text-gray-100 lowercase font-light"
						>({{ tag.templateTag.name }})</span>
					</span>
					<textarea
						v-model="tag.result"
						cols="30"
						rows="10"
						class="mt-2 p-2 bg-gray-600 bg-opacity-40 border-2 border-gray-200 shadow-lg text-gray-100 rounded"
						disabled
					/>
				</label>
				<button
					class="absolute bottom-1 right-2 flex flex-1 gap-2 justify-center p-2 rounded transition-opacity bg-gray-700 text-white mb-2 opacity-30 hover:opacity-100"
					title="скопировать результат"
					@click="() => copy(tag.result)"
				>
					<svg
						class="fill-current"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path d="M8,7 L8,8 L6.5,8 C5.67157288,8 5,8.67157288 5,9.5 L5,18.5 C5,19.3284271 5.67157288,20 6.5,20 L13.5,20 C14.3284271,20 15,19.3284271 15,18.5 L15,17 L16,17 L16,18.5 C16,19.8807119 14.8807119,21 13.5,21 L6.5,21 C5.11928813,21 4,19.8807119 4,18.5 L4,9.5 C4,8.11928813 5.11928813,7 6.5,7 L8,7 Z M16,4 L10.5,4 C9.67157288,4 9,4.67157288 9,5.5 L9,14.5 C9,15.3284271 9.67157288,16 10.5,16 L17.5,16 C18.3284271,16 19,15.3284271 19,14.5 L19,7 L16.5,7 C16.2238576,7 16,6.77614237 16,6.5 L16,4 Z M20,6.52797748 L20,14.5 C20,15.8807119 18.8807119,17 17.5,17 L10.5,17 C9.11928813,17 8,15.8807119 8,14.5 L8,5.5 C8,4.11928813 9.11928813,3 10.5,3 L16.4720225,3 C16.6047688,2.99158053 16.7429463,3.03583949 16.8535534,3.14644661 L19.8535534,6.14644661 C19.9641605,6.25705373 20.0084195,6.39523125 20,6.52797748 Z M17,6 L18.2928932,6 L17,4.70710678 L17,6 Z M11.5,13 C11.2238576,13 11,12.7761424 11,12.5 C11,12.2238576 11.2238576,12 11.5,12 L13.5,12 C13.7761424,12 14,12.2238576 14,12.5 C14,12.7761424 13.7761424,13 13.5,13 L11.5,13 Z M11.5,11 C11.2238576,11 11,10.7761424 11,10.5 C11,10.2238576 11.2238576,10 11.5,10 L16.5,10 C16.7761424,10 17,10.2238576 17,10.5 C17,10.7761424 16.7761424,11 16.5,11 L11.5,11 Z M11.5,9 C11.2238576,9 11,8.77614237 11,8.5 C11,8.22385763 11.2238576,8 11.5,8 L16.5,8 C16.7761424,8 17,8.22385763 17,8.5 C17,8.77614237 16.7761424,9 16.5,9 L11.5,9 Z" />
					</svg>
				</button>
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
		<div
			v-if="showDebug"
			class="mt-10 text-gray-600 text-sm"
		>
			<div class="bg-gray-100">
				<div class="w-full bg-gray-200 p-4">
					DEBUG MENU:
				</div>
				<div
					v-for="section in debug"
					:key="section.name"
					class="flex flex-col gap-2 p-4"
				>
					<div class="">
						{{ section.name }}
					</div>
					<div class="flex flex-row flex-wrap gap-4">
						<template
							v-for="ev in section.events"
							:key="ev.name"
						>
							<button
								v-if="ev.cell"
								class="bg-teal-700 hover:bg-teal-900 text-white font-bold px-8 py-2"
								@click="() => inputTag = inputTag.replace(ev.cell, ev.value)"
							>
								{{ ev.name }}
							</button>
							<button
								v-else
								class="bg-teal-700 hover:bg-teal-900 text-white font-bold px-8 py-2"
								@click="() => inputTag = ev.value"
							>
								{{ ev.name }}
							</button>
						</template>
					</div>
				</div>
			</div>
			<div class="bg-gray-100 mt-10">
				<div class="w-full bg-gray-200 p-4">
					LOG:
				</div>
				<pre class="overflow-x-scroll p-4 text-gray-600 text-sm">{{ tag }}</pre>
			</div>
		</div>
		<div class="flex flex-col justify-center items-center text-blue-300 text-center mt-8 mb-20">
			<div class="mb-2">
				Конвертер modx тегов в синтаксис fenom.
			</div>
			<a
				href="https://github.com/alexsoin/modx2fenom"
				class="opacity-50 hover:opacity-100"
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
