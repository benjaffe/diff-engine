'use strict';

var app = app || {};

app.diffEngine = (function() {

  var _diffArr = [];
  var _prevContent;
  var _prevDate;

  var _history = [];
	
  var _diffAndHistoryOutOfSync = true;

  var encoder = {
  	/**
  	 * Calculates the diff from the content and adds it to the diff list
  	 * @param  {string} content - the content to be diffed
  	 */
    push: function(content) {
      var diff = _generateDiff(content);
      _diffArr.push(diff);
      _diffAndHistoryOutOfSync = true;
    }
  };

  var decoder = {
    /**
		 * Get the diff array
		 * @return {array} An array of diff objects
		 */
    getDiffs: function() {
      return _diffArr;
    },

    /**
		 * Return the final state of the content
		 * @return {object}  The state object after the diffs are decoded into content
		 */
    getContent: function() {
      return _decodeContent();
    },
		
    /**
		 * Get the state of the content at dif # num
		 * @param  {integer} num - the number of the diff to be decoded
		 * @return {string}        the decoded content
		 */
    getContentAtIndex: function(num) {
      if (num > _diffArr.length - 1) {
        return null;
      }

      return _decodeContent(num);
    },

    /**
		 * Get the state of the content at a given time
		 * @param  {integer} time - ms from start to be decoded
		 * @return {string}        the decoded content
		 */
    getContentAtTime: function(time) {

    },

    /**
     * Get a timeline of decoded content
     * @return {array} timeline of decoded content
     */
    getContentTimeline: function() {
      if (_diffArr.length !== _history.length) {
        _decodeContent();
      }
      return _history;
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
	
  /**
  	 * [_decodeContent description]
  	 * @param  {[type]} _num [description]
  	 * @return {[type]}      [description]
  	 */
  function _decodeContent (_num) {
		
    if (_num === undefined) {
      _num = _diffArr.length - 1;
    }

    if (_diffArr.length === _history.length && !_diffAndHistoryOutOfSync) {
      return _history[_num];
    }

    // reset history, calculate everything from scratch
    _history = [];

    console.log('decoding');
		
    // go through the diff array
    _diffArr.forEach(function(diff, diffNum) {
      var timestampAbs, timestamp;

      // our virtual cursor
      var i = 0;

      // last string value or ''
      var str = _history[diffNum - 1] && _history[diffNum - 1].content || '';

      // run through each diff and calculate contents
      diff.content.forEach(function(diffOp) {
        if (diffOp.added) {
          str = str.substr(0, i) + diffOp.value + str.slice(i);
          i += diffOp.value.length;
        } else if (diffOp.removed) {
          str = str.substr(0, i) + str.slice(i + diffOp.count);
        } else {
          i += diffOp.count;
        }
      });

      // set the timestamps
      if (diff.timeAbsolute) {
        timestampAbs = diff.timeAbsolute;
        timestamp = 0;
      } else {
        timestampAbs = _history[diffNum - 1].timestampAbs + diff.timeRelative;
        timestamp = _history[diffNum - 1].timestamp + diff.timeRelative;
      }

      _history.push({
        content: str,
        timestamp: timestamp,
        timestampAbs: timestampAbs,
        index: _history.length
      });
    });
		
    _diffAndHistoryOutOfSync = false;

    return _history[_num];
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
