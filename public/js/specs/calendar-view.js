define(["views/calendar", "backbone", "jquery.calendar"], 
	function(CalendarView, Backbone, $) {

	return function() {
		describe("CalendarView", function() {

			var view, collection, sampleData;
			beforeEach(function() {
				sampleData = [

				];
				collection = new Backbone.Collection(sampleData);
				view = new CalendarView({
					collection : collection
				});
			});

			it("renders", function() {
				view.render();
			});

			it("has a calendar div", function() {
				view.render();
				expect(view.$el.find("#calendar").length).toEqual(1);
			});

			it("delegates to $.fullCalendar", function() {
				spyOn($.fn, "fullCalendar");
				view.render();
				expect($.fn.fullCalendar).toHaveBeenCalled();
			});

		});
	};

});
