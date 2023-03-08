<script setup lang="ts">
import { computed } from "vue";
import { TagFenom } from "@/types";
import debug from "@/debug";

const props = defineProps<{
	inputTag: string,
	tag: TagFenom,
}>();
const emit = defineEmits(["update:inputTag"]);

const inputTagValue = computed({
	get() { return props.inputTag; },
	set(value) { emit("update:inputTag", value); },
});
</script>

<template>
	<div class="mt-10 text-gray-600 text-sm">
		<div class="bg-gray-100">
			<div class="w-full bg-gray-200 p-4">
				DEBUG MENU:
			</div>
			<div class="p-4">
				<button
					class="bg-gray-700 hover:bg-gray-900 text-white font-bold px-8 py-2"
					@click="() => inputTagValue = ''"
				>
					clear input
				</button>
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
							@click="() => inputTagValue = inputTagValue.replace(ev.cell, ev.value)"
						>
							{{ ev.name }}
						</button>
						<button
							v-else
							class="bg-teal-700 hover:bg-teal-900 text-white font-bold px-8 py-2"
							@click="() => inputTagValue = ev.value"
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
</template>
