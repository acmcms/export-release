const ae3 = require("ae3");

import ru.myx.ae3.serve.SimpleServeRequest;
import ru.myx.ae3.l2.pdf.PdfTargetReplyContext;

import ru.myx.util.pdf.PdfAPI;

function createBinaryFromLayout(layout){
	const query = new SimpleServeRequest();
	query.setResourceIdentifier("/document.pdf");
	new PdfTargetReplyContext(query, null, null).transform(layout);
	return query.getResult();
}

function createBinaryFromHtml(html){
	const builder = PdfAPI.createA4('test');
	builder.appendHtml(html);
	/*
	builder.flushPage();
	builder.appendLayout({
		layout : "grid",
		width : 4,
		border : true,
		elements : [
			'Hello!',
			'World!',
			{ layout : 'link', href : 'http://capandcap.ru', title : 'Кепки...' },
			'World!',
			'Здвавствуй!',
			'Мир!',
			{
				layout : "grid",
				width : 2,
				border : false,
				elements : [
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
					{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" }
				]
			},
			{
				layout : "grid",
				width : 3,
				border : false,
				elements : [
					'Hello!',
					'World!',
					'World!',
					'Hello!',
					'World!',
					'World!'
				]
			},
			"1",
			{ layout : "image", href : "http://capandcap.ru/img$s_png450w/201405231516-4343.htm/0651-01.jpg" },
			"3",
			"4"
		]
	});
	builder.flushPage();
	builder.appendHtml(html);
	*/
	return builder.toBinary();
}

function createBinaryFromXhtml(xhtml){
	const builder = PdfAPI.createA4('test');
	builder.appendXhtml(xhtml);
	return builder.toBinary();
}

function makeDataTableBinary(layout){
	return createBinaryFromHtml(require('ae3/html').makeDataTableText(layout));
}

function makeDataTableReply(query, layout){
	const name = layout.name || 'data';
	return ae3.Reply.binary('PDF', query, makeDataTableBinary(layout), name + ".pdf");
}

function reduceFieldValue(field, value){
	if(value === null || value === undefined){
		return "";
	}
	if(field.variant === "link" && "object" !== typeof value){
		const prefix = field.prefix || "";
		const suffix = field.suffix || "";
		return {
			layout : "link",
			href : prefix + value + suffix,
			title : String(value)
		};
	}
	if("object" === typeof value && !Array.isArray(value) && !value.layout){
		return Format.jsDescribe(value);
	}
	return value;
}

/** Reduces a "data-view", "select-view" or "sequence" layout to a 2-column "grid"
 * (title | value). Reads options as well as fields/values: two of the three switches hand
 * over a layout carrying options and no fields. PDF has a native link primitive, so a
 * link-variant field becomes a real clickable node here. */
function reduceDataViewGridPdf(layout){
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

function makeDataViewReply(query, layout){
	return createBinaryFromLayout(reduceDataViewGridPdf(layout));
}

module.exports = Object.create(PdfAPI, {
	create : {
		value : createBinaryFromLayout
	},
	createBinaryFromLayout : {
		value : createBinaryFromLayout
	},
	createBinaryFromHtml : {
		value : createBinaryFromHtml
	},
	createBinaryFromXhtml : {
		value : createBinaryFromXhtml
	},
	makeDataTableBinary : {
		value : makeDataTableBinary
	},
	makeDataTableReply : {
		value : makeDataTableReply
	},
	makeDataViewReply : {
		value : makeDataViewReply
	},
	reduceDataViewGrid : {
		value : reduceDataViewGridPdf
	}
});