const ae3 = require("ae3");
const csv = require('./csv');

function makeDataTableText(layout){
	return csv.makeDataTableText(layout);
}

function makeDataTableBinary(layout){
	return ae3.Transfer.createCopierUtf8(makeDataTableText(layout));
}

function makeDataTableMessage(layout){
	return ae3.Flow.binary('TXT', 'Plain Text File', {
		"Content-Type"			: "text/plain",
		"Content-Disposition"	: "inline; filename=" + name + ".txt"
	}, ae3.Transfer.createCopierUtf8(makeDataTableText(layout)));
}

function makeDataTableReply(query, layout){
	return ae3.Reply.binary(
		'TXT', 
		query, 
		ae3.Transfer.createCopierUtf8(makeDataTableText(layout)), 
		name + ".txt"
	).setFinal();
}

function reduceFieldValue(field, value){
	if(value === null || value === undefined){
		return "";
	}
	if(field.variant === "link" && "object" !== typeof value){
		const prefix = field.prefix || "";
		const suffix = field.suffix || "";
		return prefix || suffix ? value + " (" + prefix + value + suffix + ")" : value;
	}
	if("object" === typeof value && !Array.isArray(value) && !value.layout){
		return Format.jsDescribe(value);
	}
	return value;
}

/** Reduces a "data-view", "select-view" or "sequence" layout to a 2-column "grid"
 * (title | value). Reads options as well as fields/values: two of the three switches hand
 * over a layout carrying options and no fields. Plain text has no link concept, so a
 * link-variant field is folded to "value (prefix+value+suffix)". */
function reduceDataViewGridTxt(layout){
	const fields = layout.fields || [];
	const values = layout.values || {};
	const options = layout.options || [];

	// this engine's Array.prototype has no flatMap - map, then reduce/concat one level flat
	const pairs = Array(fields).length
		? Array(fields).map(function(field){
			const key = field.id || field.name;
			return [
				field.title || field.name || key || "",
				reduceFieldValue(field, key ? values[key] : undefined)
			];
		})
		: Array(options).map(function(option){
			return [
				option.title || option.name || option.value || "",
				reduceFieldValue(option, option.value)
			];
		});

	return {
		layout : "grid",
		title : layout.title || layout.attributes && layout.attributes.title || undefined,
		width : 2,
		border : true,
		elements : pairs.reduce(function(flat, pair){
			return flat.concat(pair);
		}, [])
	};
}

function makeDataViewText(reduced){
	const elements = reduced.elements || [];
	var text = reduced.title ? reduced.title + "\n" : "";
	for(var index = 0; index < elements.length; index += 2){
		text = text + elements[index] + "\t" + elements[index + 1] + "\n";
	}
	return text;
}

function makeDataViewReply(query, layout){
	const name = layout.name || 'data-view';
	return ae3.Reply.binary(
		'TXT',
		query,
		ae3.Transfer.createCopierUtf8(makeDataViewText(reduceDataViewGridTxt(layout))),
		name + ".txt"
	).setFinal();
}

module.exports = Object.create(Object.prototype, {
	makeDataTableText : { value : makeDataTableText },
	makeDataTableBinary : { value : makeDataTableBinary },
	makeDataTableMessage : { value : makeDataTableMessage },
	makeDataTableReply : { value : makeDataTableReply },
	makeDataViewReply : { value : makeDataViewReply },
	reduceDataViewGrid : { value : reduceDataViewGridTxt },
});
