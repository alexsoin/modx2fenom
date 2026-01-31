export default {
	ru: {
		desc: "Конвертер modx тегов в синтаксис fenom.",
		copied: "Скопировано",
		ui: {
			inputTitle: "MODX (Ввод)",
			outputTitle: "Fenom (Вывод)",
			clear: "Очистить",
			copy: "Копировать",
		},
		error: {
			error: "Ошибка!",
			undefinedValue: "Не разберу, что вы ввели :(",
			emptyTemplate: "Не найден шаблон для введенного тега",
			modifier: `В теге присутствует фильтр или модификатор <code>:{0}</code> для перевода его в синтаксис fenom воспользуйтесь <a href="https://docs.modx.pro/komponentyi/pdotools/parser#%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80-Fenom" target="_blank">справочником</a>`,
			property: `В теге присутствует набор свойств <code>{0}</code> для перевода его в синтаксис fenom воспользуйтесь <a href="https://docs.modx.pro/komponentyi/pdotools/parser#%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80-Fenom" target="_blank">справочником</a>`,
		},
		info: {
			modifier: [
				{ name: "default", message: "Пример перевода модификатора default в синтаксис fenom:<br>[[+id:default=`test`]] → {$id ?: 'test'}" },
				{ name: "is", message: "Пример перевода модификатора is в синтаксис fenom:<br>[[+id:is=``:then=`test`:else=`[[+pagetitle]]`]] | {$id == '' ? 'test' : $pagetitle}" },
			]
		},
	},
	en: {
		desc: "Converter modx tags to fenom syntax.",
		copied: "Copied",
		ui: {
			inputTitle: "MODX (Input)",
			outputTitle: "Fenom (Output)",
			clear: "Clear",
			copy: "Copy",
		},
		error: {
			error: "Error!",
			undefinedValue: "I don't understand what you entered. :(",
			emptyTemplate: "Template not found for the entered tag",
			modifier: `The tag contains a filter or modifier <code>:{0}</code> to translate it into fenom syntax, use <a href="https://docs.modx.pro/komponentyi/pdotools/parser#%D0%A8% D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80-Fenom" target="_blank ">guide</a>`,
			property: `The tag has a set of properties <code>{0}</code> to translate it into fenom syntax, use <a href="https://docs.modx.pro/komponentyi/pdotools/parser#%D0%A8%D0 %B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80-Fenom" target="_blank" >guide</a>`,
		},
		info: {
			modifier: [
				{ name: "default", message: "An example of translating the default modifier into the fenom syntax:<br>[[+id:default=`test`]] → {$id ?: 'test'}" },
				{ name: "is", message: "An example of translating the is modifier into the fenom syntax:<br>[[+id:is=``:then=`test`:else=`[[+pagetitle]]`]] | {$id == '' ? 'test' : $pagetitle}" },
			]
		},
	},
};
