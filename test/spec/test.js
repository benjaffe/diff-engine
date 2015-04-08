/* global describe, it */

(function () {
	'use strict';

	String.prototype.splice = function( idx, rem, s ) {
		return (this.slice(0,idx) + (s||'') + this.slice(idx + Math.abs(rem)));
	};

	describe('Diff APIs', function () {
		
		describe('should be symmetrical', function () {

			var contentEncoder = diffEngine.getEncoder();
			var contentDecoder = diffEngine.getDecoder();
			var str = '<TextView\n    android:text=\"Hi there!\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:textSize=\"36sp\"\n    android:fontFamily=\"sans-serif-light\"\n    android:textColor=\"@android:color/black\"\n    android:padding=\"20dp\"/>';

			afterEach(function(done){
				console.log(str);
				done();
			});

			it('for adding the initial string', function () {
				contentEncoder.push(str);
				contentDecoder.getContent().should.equal(str);
			});

			it('when adding text to the end', function () {
				str = str + ' ... that\'s all folks';
				contentEncoder.push(str);
				contentDecoder.getContent().should.equal(str);
			});

			it('when adding text to the middle', function () {
				str = str.splice(28, 0, 'Oh, here we are... ');
				contentEncoder.push(str);
				contentDecoder.getContent().should.equal(str);
			});

			it('when removing text from the end', function () {
				str = str.slice(0, -21);
				contentEncoder.push(str);
				contentDecoder.getContent().should.equal(str);
			});

			it('when removing text from the middle', function () {
				str = str.splice(28, 19, '');
				contentEncoder.push(str);
				contentDecoder.getContent().should.equal(str);
			});



		});

	});
})();
