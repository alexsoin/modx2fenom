<script setup lang="ts">
import langs from "@/data/lang";
import { ref, watch } from "vue";

const props = defineProps<{
	modifiers: string,
	property: string,
	langNow: "ru"|"en",
}>();

const errors = ref<Array<string>>([]);
const infos = ref<Array<string>>([]);
const lang = ref(langs[props.langNow]);

const setArgs = (str: string, args: Array<string>) => str.replace(/{(\d+)}/g, (match: string, number: number) => typeof args[number] !== "undefined" ? args[number] : match);


watch(() => props.modifiers || props.property, () => {
	errors.value = [];
	infos.value = [];
	if(props.modifiers) {
		props.modifiers.split(":").filter(i => i).forEach(modifier => {
			const modifierInfo = lang.value.info.modifier.find(i => modifier.indexOf(i.name) >= 0) || { name: "", message: ""};

			if(modifierInfo.message) {
				infos.value.push(modifierInfo.message);
			}

			errors.value.push(setArgs(lang.value.error.modifier, [modifier.trim()]));
		});
	}
	if(props.property) {
		errors.value.push(setArgs(lang.value.error.property, [props.property.trim()]));
	}
});
</script>

<template>
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
</template>
