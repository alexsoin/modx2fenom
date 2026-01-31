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
	<div class="inline-flex flex-row items-center border rounded-lg overflow-hidden border-blue-500/30">
        <button
            v-for="langVal in listLangs"
            :key="langVal"
            @click="inputText = langVal"
            class="px-3 py-1 text-sm font-semibold transition-colors uppercase"
            :class="[
                inputText === langVal 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-900/40 text-blue-200 hover:bg-blue-800'
            ]"
        >
            {{ langVal }}
        </button>
	</div>
</template>
