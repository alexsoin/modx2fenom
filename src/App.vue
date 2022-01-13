<template>
	<div class="container">
		<h1 class="text-4xl mb-14 flex flex-row gap-3 uppercase justify-center text-gray-800 select-none mt-20">
			<a href="https://zencod.ru/articles/" target="_blank" class="hover:opacity-50 transition-opacity" title="zencod.ru">
				<img src="/favicon.svg" alt="logo zencod.ru" width="40" height="40">
			</a>
			modx2fenom
		</h1>
		<div class="flex flex-col md:flex-row gap-5 py-3">
			<div class="w-1/2 ">
				<label class="flex flex-col text-white uppercase">
					modx:
					<textarea v-model="valModx" cols="30" rows="10" spellcheck="false" class="mt-2 bg-blue-400 p-2 text-gray-800 rounded"></textarea>
				</label>
			</div>
			<div class="w-1/2 relative">
				<label class="flex flex-col text-white uppercase">
				<span class="flex flex-row gap-4 justify-between items-end">
					fenom: <span v-if="tag.templateTag" class="text-xs text-gray-100 lowercase font-light">({{ tag.templateTag.name }})</span>
				</span>
					<textarea v-model="tag.result" cols="30" rows="10" class="mt-2 p-2 bg-blue-400 text-gray-800 rounded" disabled></textarea>
				</label>
				<button @click="copy(tag.result)" class="absolute bottom-1 right-2 flex flex-1 gap-2 justify-center p-2 rounded transition-opacity bg-blue-800 text-white mb-2 opacity-30 hover:opacity-100" title="скопировать результат">
					<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path d="M8,7 L8,8 L6.5,8 C5.67157288,8 5,8.67157288 5,9.5 L5,18.5 C5,19.3284271 5.67157288,20 6.5,20 L13.5,20 C14.3284271,20 15,19.3284271 15,18.5 L15,17 L16,17 L16,18.5 C16,19.8807119 14.8807119,21 13.5,21 L6.5,21 C5.11928813,21 4,19.8807119 4,18.5 L4,9.5 C4,8.11928813 5.11928813,7 6.5,7 L8,7 Z M16,4 L10.5,4 C9.67157288,4 9,4.67157288 9,5.5 L9,14.5 C9,15.3284271 9.67157288,16 10.5,16 L17.5,16 C18.3284271,16 19,15.3284271 19,14.5 L19,7 L16.5,7 C16.2238576,7 16,6.77614237 16,6.5 L16,4 Z M20,6.52797748 L20,14.5 C20,15.8807119 18.8807119,17 17.5,17 L10.5,17 C9.11928813,17 8,15.8807119 8,14.5 L8,5.5 C8,4.11928813 9.11928813,3 10.5,3 L16.4720225,3 C16.6047688,2.99158053 16.7429463,3.03583949 16.8535534,3.14644661 L19.8535534,6.14644661 C19.9641605,6.25705373 20.0084195,6.39523125 20,6.52797748 Z M17,6 L18.2928932,6 L17,4.70710678 L17,6 Z M11.5,13 C11.2238576,13 11,12.7761424 11,12.5 C11,12.2238576 11.2238576,12 11.5,12 L13.5,12 C13.7761424,12 14,12.2238576 14,12.5 C14,12.7761424 13.7761424,13 13.5,13 L11.5,13 Z M11.5,11 C11.2238576,11 11,10.7761424 11,10.5 C11,10.2238576 11.2238576,10 11.5,10 L16.5,10 C16.7761424,10 17,10.2238576 17,10.5 C17,10.7761424 16.7761424,11 16.5,11 L11.5,11 Z M11.5,9 C11.2238576,9 11,8.77614237 11,8.5 C11,8.22385763 11.2238576,8 11.5,8 L16.5,8 C16.7761424,8 17,8.22385763 17,8.5 C17,8.77614237 16.7761424,9 16.5,9 L11.5,9 Z"/>
					</svg>
				</button>
			</div>
		</div>
		<div v-if="errors.length > 0" class="mt-2 bg-red-500 px-4 py-2 text-white rounded flex flex-col gap-4">
			<div v-for="error in errors">{{ error }}</div>
		</div>
		<pre v-hotkey="keymap" v-show="showDebug" v-html="tag" class="overflow-x-scroll p-4 bg-gray-100 mt-10 text-gray-600 text-sm"></pre>
		<div class="flex flex-col justify-center items-center text-blue-300 text-center mt-8 mb-20">
			<div class="mb-2">Конвертер modx тегов в синтаксис fenom.</div>
			<a href="https://github.com/alexsoin/modx2fenom" class="opacity-50 hover:opacity-100" target="_blank" title="репозиторий проекта"><img src="https://github.githubassets.com/favicons/favicon.svg" height="20" width="20" alt="github"></a>
		</div>
	</div>
</template>

<script>
import templates from "./templates";

export default {
	data: function () {
		return {
			valModx: '[[!pdoResources?\n\t&parents=`1`\n\t&depth=`0`\n\t&tpl=`ListRowTpl`\n\t&tplWrapper=`@INLINE [[+output]]`\n\t&includeTVs=`image`\n]]',
			valFenom: '',
			showDebug: false,
			tag: {},
			errors: [],
		}
	},
	created() {
		this.setValFenom();
	},
	watch: {
		valModx() {
			this.setValFenom();
		}
	},
	methods: {
		/**
		 * Переключение видимости меню debug (ctrl+esc)
		 */
		toggleDebug() {
			this.showDebug = !this.showDebug;
		},
		clearVal(message) {
			console.log(`clear: ${message}`);
			this.tag = {};
		},
		getMatch(str, reg) {
			return Array.from(str.matchAll(reg))[0] || [];
		},
		addError(message) {
			this.errors.push(message)
		},
		copy: function (value) {
			this.$copyText(value)
				.then(() => this.$toast.success(`Скопировано: \n${value}`))
				.catch((e) => this.$toast.error(e.message));
		},
		setValFenom() {
			const baseMatch = this.getMatch(this.valModx, /^\[\[((?:.|\n)*?)]]$/g);

			this.errors = [];
			this.tag = {};

			if(baseMatch.length === 0) {
				this.addError("Не разберу, что вы ввели :(");

				return this.clearVal("ничего не найдено");
			}

			const [ nameTag, paramsTag ] = baseMatch[1].split("?");

			const [strMatchTag, flagTag, tokenTag] = this.getMatch(nameTag, /([!])?([-*$~%!]?|[+]){1,2}?/g);
			const isLetterTag = this.getMatch(nameTag.replace(flagTag, ""), /^[a-zA-Z]/gu).length > 0;
			const templateTag = templates.find(i => i.token === tokenTag) || (isLetterTag && templates.find(i => i.name === "snippet") );
			const nameNow = nameTag.replace(tokenTag, "");

			let resultParams = "";

			if(paramsTag) {
				const trimSymbol = "%nbsp%";
				const arrParams = paramsTag.replaceAll("\n", trimSymbol).trim().replaceAll("` &", `\`${trimSymbol}&`).split(trimSymbol);

				const strParams = arrParams.map(i => {
					const match = this.getMatch(i, /&(.*?)=`(.*?)`/g);

					if(!match) return;

					const [ strMatch, key, value ] = match;

					if(!key || !value) return false;

					return `"${key}" => "${value}"`
				}).filter(i => i).join(",\n\t") || "";

				if(strParams) {
					resultParams = ` : [\n\t${strParams}\n]`;
				}
			}

			const result = templateTag && templateTag.template.replace("#NAME#", nameNow).replace("#PARAMS#", ` ${resultParams}`) || "Ошибка!";
			this.tag = { nameTag, flagTag, tokenTag, isLetterTag, templateTag, nameNow, paramsTag, resultParams, result };

			if(!templateTag) this.addError("Не найден шаблон для введенного тега");
		}
	},
	computed: {
		keymap () {
			return {
				'ctrl+esc': this.toggleDebug,
			}
		}
	},
}
</script>
