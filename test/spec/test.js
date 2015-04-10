/* global describe, it */

(function () {
  'use strict';

  String.prototype.splice = function(idx, rem, s) {
    return (this.slice(0, idx) + (s || '') + this.slice(idx + Math.abs(rem)));
  };

  describe('Diff APIs', function () {
		
    describe('should be symmetrical', function () {

      var contentEncoder = app.diffEngine.getEncoder();
      var contentDecoder = app.diffEngine.getDecoder();
      var state = {
      	// content: '<TextView\n    android:text=\"Hi there!\"\n    android:padding=\"20dp\"/>'
      	content: 'Bink'
      };
      var decodedContent;

      // it('for adding the initial string', function () {
      //   contentEncoder.push(state);

      //   decodedContent = contentDecoder.getState().state.content;
      //   decodedContent.should.equal(state.content);
      // });

      // it('when adding text to the end', function () {
      //   state.content = state.content + ' ... that\'s all folks';
      //   contentEncoder.push(state);
      //   console.log('pushing', state);

      //   decodedContent = contentDecoder.getState().state.content;
      //   decodedContent.should.equal(state.content);
      // });

      // it('when adding text to the middle', function () {
      //   state.content = state.content.splice(28, 0, 'Oh, here we are... ');
      //   contentEncoder.push(state);

      //   decodedContent = contentDecoder.getState().state.content;
      //   decodedContent.should.equal(state.content);
      // });

      // it('when removing text from the end', function () {
      //   state.content = state.content.slice(0, -21);
      //   contentEncoder.push(state);

      //   decodedContent = contentDecoder.getState().state.content;
      //   decodedContent.should.equal(state.content);
      // });

      // it('when removing text from the middle', function () {
      //   state.content = state.content.splice(28, 19, '');
      //   contentEncoder.push(state);

      //   decodedContent = contentDecoder.getState().state.content;
      //   decodedContent.should.equal(state.content);
      // });

      it('for adding the initial string to the `content` key', function () {
        contentEncoder.push(state);

        decodedContent = contentDecoder.getState().state.content;
        decodedContent.should.equal(state.content);
      });

      it('when adding text to the end to the `content` key', function () {
        state.content = state.content + ' ... that\'s all folks';
        contentEncoder.push(state);
        console.log('pushing', state);

        decodedContent = contentDecoder.getState().state.content;
        decodedContent.should.equal(state.content);
      });

      it('when adding text to the middle to the `content` key', function () {
        state.content = state.content.splice(8, 0, ' Oh, here we are ...');
        contentEncoder.push(state);

        decodedContent = contentDecoder.getState().state.content;
        decodedContent.should.equal(state.content);
      });

      it('when removing text from the end to the `content` key', function () {
        state.content = state.content.slice(0, -21);
        contentEncoder.push(state);

        decodedContent = contentDecoder.getState().state.content;
        decodedContent.should.equal(state.content);
      });

      it('when removing text from the middle to the `content` key', function () {
        state.content = state.content.splice(8, 19, '');
        contentEncoder.push(state);

        decodedContent = contentDecoder.getState().state.content;
        decodedContent.should.equal(state.content);
      });

      it('when adding a mouse position key', function () {
        state.mouse = [152, 288];
        contentEncoder.push(state);

        decodedContent = contentDecoder.getState().state.content;
        decodedContent.should.equal(state.content);
      });

      it('when changing a mouse position key', function () {
        state.mouse = [155, 288];
        contentEncoder.push(state);

        decodedContent = contentDecoder.getState().state.content;
        decodedContent.should.equal(state.content);
      });

      window.contentEncoder = contentEncoder;
      window.contentDecoder = contentDecoder;

    });

  });
})();
