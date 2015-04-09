'use strict';

var app = app || {};

app.diffEngine = (function(){

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
		},
		getContentAt: function(num) {
			if (num > _diffArr.length - 1) {
				return null;
			} else {
				return _decodeContent(_diffArr, num);
			}
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

		if (content) {
			_diff.content = app.JsDiff.diffChars(_prevContent, content);
		}

		_prevContent = content;
		_prevDate = _now;
			
		return _diff;
	}

	// TODO: decodes based on the diff index
	// this is temporary for initial testing purposes
	function _decodeContent (_arr, _num) {
		var _history = [];
		// go through the diff array
		_arr.slice(0, _num+1).forEach(function(diff, diffNum){
			var i = 0; // our virtual cursor
			var str = _history[diffNum - 1] && _history[diffNum - 1].content || ''; // last string value or ''
			var timestamp;

			if (diff.timeAbsolute) {
				timestamp = diff.timeAbsolute;
			} else {
				timestamp = _history[diffNum - 1].timestamp + diff.timeRelative;
			}

			// run through each diff
			diff.content.forEach(function(diffOp){
				if (diffOp.added) {
					str = str.substr(0, i) + diffOp.value + str.slice(i /*-1+diffOp.value.length*/ );
					i += diffOp.value.length;
				}

				else if (diffOp.removed) {
					str = str.substr(0, i) + str.slice(i+diffOp.count);
				}

				else {
					i += diffOp.count;
				}
			});

			_history.push({
				content: str,
				timestamp: timestamp
			});
		});
		

		return _history[_num].content;
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