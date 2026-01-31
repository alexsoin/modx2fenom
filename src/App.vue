<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import useHotkey, { HotKey } from "vue3-hotkey";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import ZencodLink from "@/components/ZencodLink.vue";
import { DataFenom } from "@/data/types";
import InputModx from "@/components/InputModx.vue";
import OutputFenom from "@/components/OutputFenom.vue";
import VDebug from "@/components/VDebug.vue";
import VLang from "@/components/VLang.vue";
import Logo from "@/components/ui/Logo.vue";
import AppInfo from "@/components/AppInfo.vue";
import langs from "@/data/lang";
import { parseTag } from "@/composables/parser";

Notify.init({ position: "center-top" });

const langNow = ref<"ru" | "en">("ru");
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

const hotkeys = ref<HotKey[]>([
	{
		keys: ["ctrl", "alt", "d"],
		preventDefault: true,
		handler() {
			showDebug.value = !showDebug.value;
		},
	},
]);
useHotkey(hotkeys.value);

const clearAll = () => {
	dataFenom.raw = "";
	dataFenom.out = "";
	dataFenom.name = "";
	dataFenom.modifier = "";
	dataFenom.property = "";
	dataFenom.params = [];
	dataFenom.fenom = null;
	dataFenom.modx = null;
};

const convertTag = () => {
    // If input is empty, just clear everything
    if (!inputTag.value.trim()) {
        clearAll();
        return;
    }
    
	const result = parseTag(inputTag.value, lang.value);
    
    // Update reactive object
    Object.assign(dataFenom, result);
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
				<logo />
			</h1>
		</div>
		<div class="flex flex-col md:flex-row gap-12 md:gap-5 py-3 w-full">
			<div class="flex-1">
				<input-modx v-model="inputTag" :label-clear="lang.ui.clear" />
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
			v-model:input-tag="inputTag"
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
			>
				<img
					src="https://github.githubassets.com/favicons/favicon.svg"
					height="20"
					width="20"
					alt="github"
				>
			</a>
		</div>
	</div>
</template>
