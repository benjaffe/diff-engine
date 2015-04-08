'use strict';
(function(){
	var diffEngine = {};
	var contentArr = [];

	diffEngine.getEncoder = function() {
		var encoder = {
			push: function(content) {
				contentArr.push(content);
			}
		};

		return encoder;
	};

	diffEngine.getDecoder = function() {
		var decoder = {
			getContent: function() {
				return contentArr[ contentArr.length-1 ];
			}
		};

		return decoder;
	}

	window.diffEngine = diffEngine;
})();