define(["marionette", 
	"auth",
	"jquery.calendar",
	"text!templates/calendar.html",
	"text!templates/admin-panels/calendar.html"],
	function(Marionette, Auth, $, template, AdminPanel) {

	var CalendarView = Marionette.View.extend({

		tagName : "div",

		render : function() {
			this.$el.html(template);
			this.$el.find("#calendar").fullCalendar({
				events: "api/calendar/fullcalendar",
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

			if(Auth.isAdmin()) {
				this.$el.find("#panel-container").html(AdminPanel);
			}
		},

		onShow : function() {
			this.$el.find("#calendar").fullCalendar("today");
		}

	});

	return CalendarView;
});
