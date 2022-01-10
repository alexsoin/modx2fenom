<template>
	<div class="">
		<h1 class="text-4xl mb-14 flex flex-row gap-3 uppercase text-white justify-center">
			<a href="https://zencod.ru/articles/" target="_blank" class="hover:opacity-50 transition-opacity" title="zencod.ru">
				<img src="/favicon.svg" alt="logo zencod.ru" width="40" height="40">
			</a>
			modx2fenom
		</h1>
		<form action="" class="flex flex-row gap-5">
			<label class="flex flex-col text-white uppercase">
				modx:
				<textarea v-model="valModx" cols="30" rows="10" spellcheck="false" class="bg-blue-300 p-2 text-gray-800"></textarea>
			</label>
			<label class="flex flex-col text-white uppercase">
				result (fenom):
				<textarea v-model="valFenom" cols="30" rows="10" class="bg-blue-300 p-2 text-gray-800"></textarea>
			</label>
		</form>
	</div>
</template>

<script>
import m2f from "./m2f.list";

export default {
	data: function () {
		return {
			valModx: '[[$testName? &param1=`test` &param2=`test2`\n&param3=`test3` \n&param4=`test4` ]]',
			valFenom: '',
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
		clearVal(messange) {
			console.log(`clear: ${messange}`);
			this.valFenom = '';
		},
		getMatch(str, reg) {
			return Array.from(str.matchAll(reg))[0] || [];
		},
		setValFenom() {
			const baseMatch = this.getMatch(this.valModx, /^\[\[((?:.|\n)*?)]]/g);

			if(baseMatch.length === 0) return this.clearVal("ничего не найдено");

			const [ nameTag, paramsTag ] = baseMatch[1].split("?");

			const tokenName = this.getMatch(nameTag, /(\+{2}|[\$\!\~\+])/g)[0];
			const m2fNow = tokenName ? m2f.find(i => i.tokenM === tokenName) : m2f.find(i => i.default);
			const typeNow = m2fNow.name;
			const nameNow = nameTag.replace(tokenName, "");

			const arrParams = paramsTag.replaceAll("\n", " ").replace(/\s+/g, ' ').trim().split(" ");
			const strParams = arrParams.map(i => {
				const match = this.getMatch(i, /&(.*?)=`(.*?)`/g);

				if(!match) return;

				const [ strMatch, key, value ] = match;

				if(!key || !value) return false;

				return `"${key}" => "${value}"`
			}).join(",\n\t") || "";

			const resultParams = strParams ? `: [\n\t${strParams}\n]` : '';
			const result = `{'${(m2fNow.preName || "") + nameNow}' | ${typeNow} ${resultParams}}`;

			this.valFenom = result;
		}
	}
}
</script>
