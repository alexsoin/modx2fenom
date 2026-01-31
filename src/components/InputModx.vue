<script setup lang="ts">
import { computed, ref } from "vue";
import hljs from "highlight.js/lib/core";
import modx from "@/data/highlight-modx";
import "highlight.js/styles/atom-one-dark-reasonable.css";

hljs.registerLanguage("modx", modx);

const props = defineProps<{
	modelValue: string,
    labelClear?: string,
}>();
const emit = defineEmits(["update:modelValue"]);

const inputText = computed({
	get() { return props.modelValue; },
	set(value) { emit("update:modelValue", value); },
});

const highlightedCode = computed(() => {
	if (!inputText.value) return "";
    // Access hljs safely
    try {
	    return hljs.highlight(inputText.value, { language: "modx" }).value + "<br>"; // <br> for newline handling
    } catch (e) {
        return inputText.value;
    }
});

const syncScroll = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    const pre = target.nextElementSibling as HTMLPreElement;
    if (pre) {
        pre.scrollTop = target.scrollTop;
        pre.scrollLeft = target.scrollLeft;
    }
}
</script>

<template>
	<label class="flex flex-col text-white relative group">
		<span class="uppercase font-bold mb-1 ml-1 opacity-80 text-sm">modx:</span>
        <div class="mt-2 relative w-full h-64 rounded bg-blue-900 border border-white/20 shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
            <textarea
                v-model="inputText"
                spellcheck="false"
                class="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono resize-none focus:outline-none z-10 overflow-auto whitespace-pre-wrap break-all leading-relaxed"
                @scroll="syncScroll"
            />
            <pre
                class="absolute inset-0 w-full h-full p-4 font-mono z-0 overflow-hidden whitespace-pre-wrap break-all leading-relaxed pointer-events-none"
                aria-hidden="true"
            ><code class="hljs language-modx bg-transparent p-0 !overflow-hidden block h-full w-full" v-html="highlightedCode" /></pre>
        </div>

		<button
			v-if="inputText"
			class="absolute bottom-3 right-4 p-2 rounded bg-gray-700 text-white opacity-50 hover:opacity-100 hover:bg-gray-600 transition-all text-xs z-20"
			@click="inputText = ''"
		>
			{{ labelClear || 'Clear' }}
		</button>
	</label>
</template>
