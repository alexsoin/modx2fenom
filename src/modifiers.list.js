export default [
	{ name: "default", message: "Пример перевода модификатора default в синтаксис fenom:<br>[[+id:default=`test`]] → {$id ?: 'test'}" },
	{ name: "is", message: "Пример перевода модификатора is в синтаксис fenom:<br>[[+id:is=``:then=`test`:else=`[[+pagetitle]]`]] | {$id == '' ? 'test' : $pagetitle}" },
];
