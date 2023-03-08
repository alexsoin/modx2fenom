<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	modelValue: string,
}>();
const emit = defineEmits(["update:modelValue"]);

const inputText = computed({
	get() { return props.modelValue; },
	set(value) { emit("update:modelValue", value); },
});
</script>

<template>
	<label class="flex flex-col text-white uppercase">
		modx:
		<textarea
			v-model="inputText"
			cols="30"
			rows="10"
			spellcheck="false"
			class="mt-2 p-2 bg-gray-600 bg-opacity-40 border-2 border-gray-200 shadow-lg text-gray-100 rounded"
		/>
	</label>
</template>
