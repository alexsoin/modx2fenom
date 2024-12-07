type DataFenom = {
	raw: string,
	out: string,
	name: string,
	modifier: string,
	property: string,
	params: {
		name: string;
		value: string;
	}[],
	fenom: {
		flagNoCache: string,
		template?: {
			name: string;
			token: string|boolean;
			template: string;
		},
	} | null,
	modx: {
		key: string,
		params: string,
	} | null,
};

export type { DataFenom };
