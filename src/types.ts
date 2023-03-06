type TagFenom = {
	nameTag: string,
	nameTagPre: string,
	modifierTag: string,
	propertyTag: string,
	flagTag: string,
	tokenTag: string,
	isLetterTag: boolean,
	templateTag: {
		name: string,
		token: string|boolean,
		template: string,
	} | false | undefined,
	nameNow: string,
	paramsTag: string,
	resultParams: string,
	result: string,
};

export type { TagFenom };
