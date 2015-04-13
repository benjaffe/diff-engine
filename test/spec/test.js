/* global describe, it */

(function () {
  'use strict';

  String.prototype.splice = function(idx, rem, s) {
    return (this.slice(0, idx) + (s || '') + this.slice(idx + Math.abs(rem)));
  };

  describe('Diff APIs', function () {
		
    describe('should be symmetrical across all sorts of transformations', function () {
    	var diffEngine = window.diffEngine();
      var stateEncoder = diffEngine.getEncoder();
      var stateDecoder = diffEngine.getDecoder();
      var state = {
      	// content: '<TextView\n    android:text=\"Hi there!\"\n    android:padding=\"20dp\"/>'
      	content: 'Bink'
      };
      var decodedState, prevState, i;

      it('when adding the initial string to the `content` key', function () {
        i = stateEncoder.push(state);

        decodedState = stateDecoder.getStateAtIndex(i);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.equal(0);
      });

      it('when adding text to the end to the `content` key', function () {
        state.content = state.content + ' ... that\'s all folks';
        i = stateEncoder.push(state);
        
        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        console.log('hi');
        console.log(i, decodedState, prevState);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when adding text to the middle to the `content` key', function () {
        state.content = state.content.splice(8, 0, ' Oh, here we are ...');
        i = stateEncoder.push(state);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when removing text from the end to the `content` key', function () {
        state.content = state.content.slice(0, -21);
        i = stateEncoder.push(state);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when removing text from the middle to the `content` key', function () {
        state.content = state.content.splice(8, 19, '');
        i = stateEncoder.push(state);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when adding a mouse position key', function () {
        state.mouse = [152, 288];
        i = stateEncoder.push(state);

        decodedState = stateDecoder.getStateAtIndex(i);
        prevState = stateDecoder.getStateAtIndex(i - 1);
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(prevState.timestamp);
      });

      it('when changing a mouse position key', function () {
        state.mouse = [155, 288];
        i = stateEncoder.push(state);

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
