define(["marionette", "backbone", "jquery.calendar", "text!templates/calendar.html"],
	function(Marionette, Backbone, $, template) {

	var CalendarView = Backbone.View.extend({

		tagName : "div",
		className: "row",

		render : function() {
			this.$el.html(template);
			this.$el.find("#calendar").fullCalendar({
				events: "api/calendar",
				firstDay: 1,
				defaultView: "month",
				monthNames: 
					["Januari", 
						"Februari", 
						"Mars", 
						"April", 
						"Maj", 
						"Juni",
						"Juli",
						"Augusti",
						"September", 
						"Oktober", 
						"November", 
						"December"],
				dayNames: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"],
				dayNamesShort: ["Sö", "Må", "Ti", "On", "To", "Fr", "Lö"]
			});
		}

	});

	return CalendarView;
});
