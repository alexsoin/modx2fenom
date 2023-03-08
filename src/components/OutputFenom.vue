<script setup lang="ts">
import useClipboard from "vue-clipboard3";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { TagFenom } from "@/types";

defineProps<{
	fenomOut: TagFenom,
}>();

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
</script>

<template>
	<label class="flex flex-col text-white uppercase">
		<span class="flex flex-row gap-4 justify-between items-end">
			fenom:
			<span
				v-if="fenomOut.templateTag"
				class="text-xs text-gray-100 lowercase font-light"
			>
				({{ fenomOut.templateTag.name }})
			</span>
		</span>
		<textarea
			:value="fenomOut.result"
			cols="30"
			rows="10"
			class="mt-2 p-2 bg-gray-600 bg-opacity-40 border-2 border-gray-200 shadow-lg text-gray-100 rounded"
			disabled
		/>
	</label>
	<button
		class="absolute bottom-1 right-2 flex flex-1 gap-2 justify-center p-2 rounded transition-opacity bg-gray-700 text-white mb-2 opacity-30 hover:opacity-100"
		title="скопировать результат"
		@click="() => copy(fenomOut.result)"
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
</template>
