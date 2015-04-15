/* global describe, it */

(function () {
  'use strict';

  String.prototype.splice = function(idx, rem, s) {
    return (this.slice(0, idx) + (s || '') + this.slice(idx + Math.abs(rem)));
  };

  describe('Diff Engines should be distinct', function() {

    it('Engine prototype methods should be the same', function() {
      var a = window.diffEngine();
      (a.getEncoder === a.getEncoder).should.equal(true);
      (a.getDecoder === a.getDecoder).should.equal(true);
    });
  	
    it('New Engines should be different', function() {
      var a = window.diffEngine();
      var b = window.diffEngine();
      (a === b).should.equal(false);
    });

    it('New Encoders should be different', function() {
      var a = window.diffEngine();
      (a.getEncoder() === a.getEncoder()).should.equal(false);
    });

    it('New Decoders should be different', function() {
      var a = window.diffEngine();
      (a.getDecoder([]) === a.getDecoder([])).should.equal(false);
    });

  });

  describe('Diff APIs', function () {
		
    describe('should be symmetrical across all sorts of transformations', function () {
      var diffEngine = window.diffEngine();
      var stateEncoder = diffEngine.getEncoder();
      var state = {
        // content: '<TextView\n    android:text=\"Hi there!\"\n    android:padding=\"20dp\"/>'
        content: 'Bink'
      };
      var stateDecoder;
      var decodedState;
      var prevState;
      var diffs;
      var i;

      it('when adding the initial string to the `content` key', function () {
        stateEncoder.push(state);
        diffs = stateEncoder.getDiffs();
        i = diffs.length - 1;
        stateDecoder = diffEngine.getDecoder(diffs);

        stateDecoder.setDiffs(diffs);
        decodedState = stateDecoder.getStateAtIndex(i);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.equal(0);
      });

      it('when adding text to the end to the `content` key', function () {
        state.content = state.content + ' ... that\'s all folks';
        stateEncoder.push(state);
        diffs = stateEncoder.getDiffs();
        i = diffs.length - 1;
        
        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when adding text to the middle to the `content` key', function () {
        state.content = state.content.splice(8, 0, ' Oh, here we are ...');
        stateEncoder.push(state);
        diffs = stateEncoder.getDiffs();
        i = diffs.length - 1;

        stateDecoder.setDiffs(diffs);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when removing text from the end to the `content` key', function () {
        state.content = state.content.slice(0, -21);
        stateEncoder.push(state);
        diffs = stateEncoder.getDiffs();
        i = diffs.length - 1;

        stateDecoder.setDiffs(diffs);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when removing text from the middle to the `content` key', function () {
        state.content = state.content.splice(8, 19, '');
        stateEncoder.push(state);
        diffs = stateEncoder.getDiffs();
        i = diffs.length - 1;

        stateDecoder.setDiffs(diffs);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when adding a mouse position key', function () {
        state.mouse = [152, 288];
        stateEncoder.push(state);
        diffs = stateEncoder.getDiffs();
        i = diffs.length - 1;

        stateDecoder.setDiffs(diffs);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when changing a mouse position key', function () {
        state.mouse = [155, 288];
        stateEncoder.push(state);
        diffs = stateEncoder.getDiffs();
        i = diffs.length - 1;

        stateDecoder.setDiffs(diffs);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      window.stateEncoder = stateEncoder;
      window.stateDecoder = stateDecoder;

    });

  });
})();
