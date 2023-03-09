<script setup lang="ts">
import { computed, onMounted } from "vue";
import lang from "@/data/lang";

const props = defineProps<{
	modelValue: string,
}>();
const emit = defineEmits(["update:modelValue"]);

const listLangs = Object.keys(lang);

const inputText = computed({
	get() { return props.modelValue; },
	set(value) {
		localStorage.setItem("lang-app", value);
		emit("update:modelValue", value);
	},
});

onMounted(() => {
	const langApp = localStorage.getItem("lang-app");

	if(langApp) {
		inputText.value = langApp;
	}
});
</script>

<template>
	<div class="inline-flex flex-row items-center border rounded text-white border-white opacity-50">
		<svg
			class="h-6 w-6"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path
				stroke="none"
				d="M0 0h24v24H0z"
			/>
			<path d="M5 7h7m-2 -2v2a5 8 0 0 1 -5 8m1 -4a7 4 0 0 0 6.7 4" />
			<path d="M11 19l4 -9l4 9m-.9 -2h-6.2" />
		</svg>
		<select
			v-model="inputText"
			class="bg-transparent"
		>
			<option
				v-for="langVal in listLangs"
				:key="langVal"
				:value="langVal"
			>
				{{ langVal.toUpperCase() }}
			</option>
		</select>
	</div>
</template>
