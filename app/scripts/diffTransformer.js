'use strict';

window.diffEngine = (function(){

	var _contentArr = [];
	var _prevContent = '';

	var encoder = {
		push: function(content) {
			_contentArr.push(content);
		}
	};

	var decoder = {
		getContent: function() {
			return _contentArr[ _contentArr.length-1 ];
		}
	};

	function getEncoder() {
		return encoder;
	}

	function getDecoder() {
		return decoder;
	}

	return {
		getEncoder: getEncoder,
		getDecoder: getDecoder
	};

})();