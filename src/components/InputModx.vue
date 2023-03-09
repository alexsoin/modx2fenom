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
			class="mt-2 p-2 bg-blue-900 border border-white shadow-lg rounded focus:outline-none focus:ring focus:ring-blue-700"
		/>
	</label>
</template>
