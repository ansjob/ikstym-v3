define(["utils/date"], function(DateUtils) {

	return function() {

		describe("DateUtils", function() {

			var newYear = 1356994800;

			it("can get year in sweden from a timestamp", function() {
				expect(DateUtils.timeStampTo.year(newYear)).toEqual(2013);
			});

			it("can get month in sweden from a timestamp", function() {
				expect(DateUtils.timeStampTo.month(newYear)).toEqual(0);
			});

			it("can get day in sweden from a timestamp", function() {
				expect(DateUtils.timeStampTo.day(newYear)).toEqual(1);
			});

			it("can get the hour in sweden from a timestamp", function() {
				expect(DateUtils.timeStampTo.hours(newYear)).toEqual(0);
			});


			it("can get the minute in sweden from a timestamp", function() {
				expect(DateUtils.timeStampTo.minute(newYear)).toEqual(0);
			});



			it("can get year in sweden from a different timestamp", 
			function() {
				expect(DateUtils.timeStampTo.year(newYear-1)).toEqual(2012);
			});

			it("can get month in sweden from a different timestamp",
			function() {
				expect(DateUtils.timeStampTo.month(newYear-1)).toEqual(11);
			});

			it("can get day in sweden from a different timestamp", 
			function() {
				expect(DateUtils.timeStampTo.day(newYear-1)).toEqual(31);
			});

			it("can get the hour in sweden from a different timestamp", function() {
				expect(DateUtils.timeStampTo.hours(newYear-1)).toEqual(23);
			});

			it("can get the minute in sweden from a different timestamp", function() {
				expect(DateUtils.timeStampTo.minute(newYear-1)).toEqual(59);
			});

		});

	};

});
