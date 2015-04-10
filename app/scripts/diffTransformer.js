'use strict';

var app = app || {};

app.diffEngine = (function() {

  var _diffArr = [];
  var _prevStateStr = JSON.stringify({});
  var _prevDate;

  var _history = [];
	
  var _diffAndHistoryOutOfSync = true;

  var encoder = {
    /**
    	 * Calculates the diff from the state and adds it to the diff list
    	 * @param  {string} state - the state to be diffed
    	 */
    push: function(state) {
      var diff = _generateDiff(state);
      _diffArr.push(diff);
      _diffAndHistoryOutOfSync = true;
      return _diffArr.length - 1;
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
		 * Return the state after ALL diffs
		 * @return {object}  The state object after the diffs are decoded
		 */
    getState: function() {
      return _decodeState();
    },
		
    /**
		 * Get the state at dif # num
		 * @param  {integer} num - the number of the diff to be decoded
		 * @return {string}        the decoded state
		 */
    getStateAtIndex: function(num) {
      if (num > _diffArr.length - 1) {
        return null;
      }

      return _decodeState(num);
    },

    /**
		 * Get the state at a given time
		 * @param  {integer} time - ms from start to be decoded
		 * @return {string}        the decoded state
		 */
    getStateAtTime: function(time) {

    },

    /**
     * Get a timeline of decoded state
     * @return {array} timeline of decoded state
     */
    getStateTimeline: function() {
      if (_diffArr.length !== _history.length) {
        _decodeState();
      }
      return _history;
    }
  };

  /** Converts a state object into a diff object */
  function _generateDiff (_state) {
    var _diff = {};
    var _now = Date.now();
    
    var _stateStr = JSON.stringify(_state);
    
    if (_prevStateStr === '{}') {
      console.log('FIRST');
      _diff.timeAbsolute = _now;
    } else {
      _diff.timeRelative = _now - _prevDate;
    }

    if (_stateStr) {
      _diff.diffOps = app.JsDiff.diffChars(_prevStateStr, _stateStr);
    }

    _prevStateStr = _stateStr;
    _prevDate = _now;

    console.log(_diff);
			
    return _diff;
  }

  /**
	 * reconstruct a state timeline based on the diffs, and return a state object
	 * @param  {[number]} _num - optional index to decode and return (if omitted, returns the final state)
	 * @return {[type]}      [state]
	 */
  function _decodeState (_num) {
		
    if (_num === undefined) {
      _num = _diffArr.length - 1;
    }

    if (_diffArr.length === _history.length && !_diffAndHistoryOutOfSync) {
      return _history[_num];
    }

    // reset stateHistory, calculate everything from scratch
    _history = [];

    console.log('decoding');
		
    // go through the diff array
    _diffArr.forEach(function(_diff, _diffNum) {
      var timestampAbs, timestamp;

      // our virtual cursor
      var i = 0;

      // last string value or ''
      var stateStr = _history[_diffNum - 1] && JSON.stringify(_history[_diffNum - 1].state) || '{}';

      // run through each diff and calculate state
      _diff.diffOps.forEach(function(diffOp) {
        if (diffOp.added) {
          console.debug('ADDED ' + diffOp.value);
          stateStr = stateStr.substr(0, i) + diffOp.value + stateStr.slice(i);
          i += diffOp.value.length;
        } else if (diffOp.removed) {
          console.debug('REMOVED ' + stateStr.substr(i, diffOp.count));
          stateStr = stateStr.substr(0, i) + stateStr.slice(i + diffOp.count);
        } else {
          i += diffOp.count;
        }
      });

      // set the timestamps
      if (_diff.timeAbsolute) {
        timestampAbs = _diff.timeAbsolute;
        timestamp = 0;
      } else {
        timestampAbs = _history[_diffNum - 1].timestampAbs + _diff.timeRelative;
        timestamp = _history[_diffNum - 1].timestamp + _diff.timeRelative;
      }

      _history.push({
        state: JSON.parse(stateStr),
        timestamp: timestamp,
        timestampAbs: timestampAbs,
        index: _history.length
      });

      console.log(_history[_diffNum] && _history[_diffNum].state, _history[_diffNum]);

    });
		
    _diffAndHistoryOutOfSync = false;
    console.log(_history[_num]);
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
