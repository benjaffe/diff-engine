/* global describe, it */

(function () {
  'use strict';

  String.prototype.splice = function(idx, rem, s) {
    return (this.slice(0, idx) + (s || '') + this.slice(idx + Math.abs(rem)));
  };

  describe('Diff APIs', function () {
		
    describe('should be symmetrical', function () {

      var stateEncoder = app.diffEngine.getEncoder();
      var stateDecoder = app.diffEngine.getDecoder();
      var state = {
      	// content: '<TextView\n    android:text=\"Hi there!\"\n    android:padding=\"20dp\"/>'
      	content: 'Bink'
      };
      var decodedState, previousTime;

      it('for adding the initial string to the `content` key', function () {
        stateEncoder.push(state);

        decodedState = stateDecoder.getState();
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.equal(0);
        previousTime = decodedState.timestamp;
      });

      it('when adding text to the end to the `content` key', function () {
        state.content = state.content + ' ... that\'s all folks';
        stateEncoder.push(state);
        console.log('pushing', state);

        decodedState = stateDecoder.getState();
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(previousTime);
        previousTime = decodedState.timestamp;
      });

      it('when adding text to the middle to the `content` key', function () {
        state.content = state.content.splice(8, 0, ' Oh, here we are ...');
        stateEncoder.push(state);

        decodedState = stateDecoder.getState();
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(previousTime);
        previousTime = decodedState.timestamp;
      });

      it('when removing text from the end to the `content` key', function () {
        state.content = state.content.slice(0, -21);
        stateEncoder.push(state);

        decodedState = stateDecoder.getState();
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(previousTime);
        previousTime = decodedState.timestamp;
      });

      it('when removing text from the middle to the `content` key', function () {
        state.content = state.content.splice(8, 19, '');
        stateEncoder.push(state);

        decodedState = stateDecoder.getState();
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(previousTime);
        previousTime = decodedState.timestamp;
      });

      it('when adding a mouse position key', function () {
        state.mouse = [152, 288];
        stateEncoder.push(state);

        decodedState = stateDecoder.getState();
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(previousTime);
        previousTime = decodedState.timestamp;
      });

      it('when changing a mouse position key', function () {
        state.mouse = [155, 288];
        stateEncoder.push(state);

        decodedState = stateDecoder.getState();
        decodedState.state.content.should.equal(state.content);
        decodedState.timestamp.should.be.above(previousTime);
        previousTime = decodedState.timestamp;
      });

      window.stateEncoder = stateEncoder;
      window.stateDecoder = stateDecoder;

    });

  });
})();
