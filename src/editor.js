import "codemirror/lib/codemirror.css";
import "codemirror/theme/lucario.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/xml-hint";
import "codemirror/addon/selection/active-line";
import "codemirror/mode/xml/xml";

OCA.Books.Editor = (function() {
	var _schemaOpf = {
		"!top": ["one"],
		one: {children: ["two","three"]},
		two: {children: []},
		three: {children: []}
	};

	var _cm = require("codemirror");
	var _editor = undefined;
	var _options = {
		mode: "xml",
		lineNumbers: true,
		styleActiveLine: true,
		matchTags: true,
		autoCloseTags: true,
		extraKeys: {
			"Ctrl-Space": "autocomplete"
		},
		hintOptions: {
			completeSingle: false,
			schemaInfo: _schemaOpf
		},
		theme: "default"
	};

	window.addEventListener("themechange", function(evt){
		_options.theme = evt.detail;
		if (_editor) {
			_editor.setOption("theme", evt.detail);
		}
	});

	return {
		init: function(selector) {
			if (_editor === undefined) {
				_editor = _cm.fromTextArea(document.querySelector(selector), _options);
				_editor.refresh();
			}
		},

		close: function() {
			if (_editor) {
				_editor.toTextArea();
				_editor = undefined;
			}
		},

		setValue: function(content) {
			if (_editor) {
				_editor.setValue(content);
			}
		}
	};
})();