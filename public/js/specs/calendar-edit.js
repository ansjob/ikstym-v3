//Test file for the screen to edit a calendar item.
define(["views/calendar-edit", "models/calendar-item", "backbone"], 
function(EditView, CalendarItem, Backbone) {

	return function() {

		describe("Calendar Edit Screen", function() {
			var model, view;
			var testEvent = {
				id : 4711,
				start : new Date(2012, 01, 12, 14, 30).getTime(),
				end : new Date(2012, 01, 12, 15, 30).getTime(),
				title : "Derp-träning",
				description : "Derp-test för att bla bla bla",
				type : "TRAINING",
			};

			beforeEach(function() {
				model = new CalendarItem();

				view = new EditView({
					model : model
				});

			});

			it("renders", function() {
				view.render();
			});

		});
	};

});
