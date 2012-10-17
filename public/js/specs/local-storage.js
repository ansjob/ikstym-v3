define([], function() {
	return function() {

		describe("HTML5 Local Storage", function() {
			it("is defined", function() {
				expect(localStorage).toBeDefined();
			});

			it("lets me set/get a string", function() {
				var testStr = "testString 12334567";
				localStorage.setItem("testKey", testStr);
				var str = localStorage.getItem("testKey");
				expect(str).toEqual(testStr);
			});

			it("lets me get/set a complex object (using jquery)", function() {
				var testObj = {
					foo : 'bar',
					baz : 123,
					key : {
						nested : 456,
						foo : 'hello'
					}
				};
				localStorage.setItem("testObject", JSON.stringify(testObj));
				var fromStorage = $.parseJSON(localStorage.getItem("testObject"));
				expect(fromStorage).toEqual(testObj);
			});
		});
	};
});
