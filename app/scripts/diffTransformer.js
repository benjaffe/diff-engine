'use strict';

window.diffEngine = (function(){

	var _diffArr = [];
	var _prevContent;
	var _prevDate;

	var encoder = {
		push: function(content) {
			var diff = _generateDiff(content);
			_diffArr.push(diff);
		}
	};

	var decoder = {
		getContent: function() {
			return _decodeContent(_diffArr, _diffArr.length - 1);
		}
	};

	function _generateDiff (content) {
		var _diff = {};
		var _now = Date.now();

		if (!_prevContent) {
			_diff.timeAbsolute = _now;
		} else {
			_diff.timeRelative = _now - _prevDate;
		}

		_prevContent = content;
		_prevDate = _now;
			
		// TODO: contains the full content (meaning it's not really a diff!)
		// this is temporary for initial testing purposes
		_diff.content = content;

		return _diff;
	}

	// TODO: decodes based on the diff index
	// this is temporary for initial testing purposes
	function _decodeContent (_arr, _num) {
		return _arr[_num].content;
	}

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