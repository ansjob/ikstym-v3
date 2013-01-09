define(
	[
	"marionette",
	"jquery",
	"models/calendar-item",
	"text!templates/calendar-form.html"
	],
	function(Marionette, $, CalendarItem, template) {

	var CalendarItemEditView = Marionette.ItemView.extend({

		template : function(item) {
			return template;
		}

	});

	return CalendarItemEditView;

});
