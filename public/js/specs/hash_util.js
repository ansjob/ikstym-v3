define(["utils"], 

	function(Utils) {

	return function() {
		describe("hash function", function() {
			it("is compatible with the old hash", function() {

				var pwd = "test123"
				var hash = Utils.hash(pwd);
				expect(hash).toEqual("09dd1a43acf7a4a9fabec9f3bb1483f01c7bd3acab2c5dcf041d6ce007e7275d69453a4232516466791ac333cc3bf75efad42551fe3e785d34e16295e35672bc");
			});
		});


	};
});
