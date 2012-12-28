define(["auth", "views/guestbook-page", "marionette"], function(Auth, Guestbook, Marionette) {
	return function() {

		describe("Guestbook Entry renderer", function() {

			var vent;

			var sampleAdmin = {
				username : 'testusername',
				password : 'testhash123',
				first_name: 'Test',
				last_name: 'Testsson',
				email: 'testarn@testplace.se',
				phone: 1234567,
				locked: false,
				admin: true,
				nick: 'TestArn'
			};

			var sample_entry = {
				id: 4711,
				ip: "192.168.0.15",
				text: "sample entry",
				timestamp: 0,
				userdata : sampleAdmin,
			};

			var GBEntry = Backbone.Model.extend({urlRoot : "/api/guestbook"});

			var entry, entryView;

			beforeEach(function() {
					var vent = new Marionette.EventAggregator();
					entry = new GBEntry(sample_entry);
					entryView = new Guestbook.Entry({ model: entry});
					entryView.render();
			});


			describe("regular user scenario", function() {

				beforeEach(function() {
					Auth.clearData();
				});

			});

			describe("admin scenario", function() {

				beforeEach(function() {
					Auth.saveUserDetails(sampleAdmin);
					entryView.render();
				});

				afterEach(function() {
					Auth.clearData();
				});

				it("renders the IP if logged in as admin", function() {
					expect(entryView.$el.html()).toContain(sample_entry.ip);
				});

				it("renders a delete link", function() {
					expect(entryView.$el.find(".delete").length).toEqual(1);
				});

				describe("Delete link", function() {
					var link;
					beforeEach(function() {
						link = entryView.$el.find(".delete");
					});

					it("sets the status message to a wait message", function() {
						spyOn(entry, "destroy");
						$(link).click();
						expect(entryView.$el.find(".status")).toHaveHtml("Vänta...");
					});

					it("calls destroy", function() {
						spyOn(entry, "destroy");
						$(link).click();
						expect(entry.destroy).toHaveBeenCalled();
					});


					it("sets the responseText as error", function() {
						spyOn(entry, "destroy");
						$(link).click();
						var args = entry.destroy.mostRecentCall.args[0];
						var sampleRes = "Foo error msg";
						args.error(entry, {responseText : sampleRes});
						expect(entryView.$el.find(".status")).toHaveHtml(sampleRes);
					});

					it("doesn't remove the view on server error", function() {
						spyOn(entry, "destroy");
						var spy = jasmine.createSpy();
						entryView.on("close", spy);
						$(link).click();
						var args = entry.destroy.mostRecentCall.args[0];
						args.error(entry, {responseText : "foo"});
						expect(spy).not.toHaveBeenCalled();
					});

				});

			});

		});

	};
});
