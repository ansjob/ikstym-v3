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

			describe("converting date to timestamp", function() {

				var newyear, leapday;
				beforeEach(function() {
					newyear = {
						year: 2013,
						month	: 0,
						date	: 1,
						hour	: 0,
						minute	: 0
					};

					leapday = {
						year	: 2012,
						month	: 1,
						date	: 29,
						hour	: 3,
						minute	: 45
					}
				});

				it("converts newyear to the correct timestamp", 
				function() {
					expect(DateUtils.getTimestamp(newyear)).toEqual(1356994800);
				});

				it("converts a leap day to the correct timestamp",
				function() {
					expect(DateUtils.getTimestamp(leapday)).toEqual(1330483500);
				});

			});

		});

	};

});
