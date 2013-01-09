define(["underscore"], function(_) {

	var DateUtils = {

		timeStampTo : {

			year : function(timestamp) {
				var date = DateUtils.offsetDate(timestamp);
				return 1900 + date.getYear();
			},
			month : function(timestamp) {
				var date = DateUtils.offsetDate(timestamp);
				return date.getMonth();
			},
			day : function(timestamp) {
				var date = DateUtils.offsetDate(timestamp);
				return date.getDate();
			},

			hours : function(timestamp) {
				var date = DateUtils.offsetDate(timestamp);
				return date.getHours();
			},

			minute : function(timestamp) {
				var date = DateUtils.offsetDate(timestamp);
				return date.getMinutes();
			}
		},

		offsetFromStockholm : function() {
			return new Date(2013, 0, 1).getTime() - 1356994800000;
		}(),

		offsetDate : function(timestamp) {
			return new Date(timestamp*1000 + DateUtils.offsetFromStockholm);
		},

		getTimestamp : function(date) {
			console.log("offset is " + DateUtils.offsetFromStockholm);
			return (new Date(date.year, date.month, date.date, date.hour, date.minute)
				.getTime() - DateUtils.offsetFromStockholm) / 1000;
		}

	};

	_.bindAll(DateUtils);

	return DateUtils;

});
