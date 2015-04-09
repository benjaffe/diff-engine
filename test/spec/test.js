/* global describe, it */

(function () {
	'use strict';

	String.prototype.splice = function( idx, rem, s ) {
		return (this.slice(0,idx) + (s||'') + this.slice(idx + Math.abs(rem)));
	};

	describe('Diff APIs', function () {
		
		describe('should be symmetrical', function () {

			var contentEncoder = app.diffEngine.getEncoder();
			var contentDecoder = app.diffEngine.getDecoder();
			var str = '<TextView\n    android:text=\"Hi there!\"\n    android:padding=\"20dp\"/>';

			it('for adding the initial string', function () {
				var decodedContent;
				contentEncoder.push(str);
				decodedContent = contentDecoder.getContent().content;
				decodedContent.should.equal(str);
			});

			it('when adding text to the end', function () {
				str = str + ' ... that\'s all folks';
				var decodedContent;
				contentEncoder.push(str);
				decodedContent = contentDecoder.getContent().content;
				decodedContent.should.equal(str);
			});

			it('when adding text to the middle', function () {
				str = str.splice(28, 0, 'Oh, here we are... ');
				var decodedContent;
				contentEncoder.push(str);
				decodedContent = contentDecoder.getContent().content;
				decodedContent.should.equal(str);
			});

			it('when removing text from the end', function () {
				str = str.slice(0, -21);
				var decodedContent;
				contentEncoder.push(str);
				decodedContent = contentDecoder.getContent().content;
				decodedContent.should.equal(str);
			});

			it('when removing text from the middle', function () {
				str = str.splice(28, 19, '');
				var decodedContent;
				contentEncoder.push(str);
				decodedContent = contentDecoder.getContent().content;
				decodedContent.should.equal(str);
			});



		});

	});
})();
