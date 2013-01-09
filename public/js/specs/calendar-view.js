define(["views/calendar", "backbone", "auth", "jquery.calendar", "jquery.cookies", ], 
	function(CalendarView, Backbone, Auth, $) {

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

			it("has access to jquery.cookies", function() {
				expect(typeof($.cookie)).toEqual("function");
			});

			describe("regular user logged in", function() {
				beforeEach(function() {
					Auth.clearData();
					Auth.saveUserDetails({
						username : "test",
						password : "foohash",
						first_name : "Olle",
						last_name : "Persson",
						hash : "foohash",
						email : "foo@bar.se",
						admin : false
					});
					view.render();
				});

				afterEach(function() {
					Auth.clearData();
				});

				it("does not render a control panel", function() {
					expect(view.$el.find(".adminpanel").length).toEqual(0);
				});

				it("has an empty container for the control-panel", function() {
					expect(view.$el.find("#panel-container").length).toEqual(1);
					expect(view.$el.find("#panel-container").html()).toEqual('');
				});

				it("returns false on Auth.isAdmin()", function() {
					expect(Auth.isAdmin()).toBeFalsy();
				});
			});

			describe("not logged in", function() {
				beforeEach(function() {
					Auth.clearData();
					view.render();
				});

				it("has no adminpanel", function() {
					expect(view.$el.find(".adminpanel").length).toEqual(0);
				});

				it("has an empty container for the control-panel", function() {
					expect(view.$el.find("#panel-container").length).toEqual(1);
					expect(view.$el.find("#panel-container").html()).toEqual('');
				});

			});

			describe("admin logged in", function() {
				beforeEach(function() {
					Auth.clearData();
					Auth.saveUserDetails({
						username : "test",
						password : "foohash",
						first_name : "Olle",
						last_name : "Persson",
						hash : "foohash",
						email : "foo@bar.se",
						admin : "true"
					});
					view.render();
				});

				afterEach(function() {
					Auth.clearData();
				});

				it("returns true on Auth.isAdmin()", function() {
					expect(Auth.isAdmin()).toBeTruthy();
				});

				it("has an admin panel", function() {
					expect(view.$el.find(".adminpanel").length).toEqual(1);
				});
			});


		});
	};

});
