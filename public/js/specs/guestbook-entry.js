define(["views/guestbook-page"], function(Guestbook) {
	return function() {

		describe("Guestbook Entry renderer", function() {

			var sampleAdmin = {
				username : 'testusername',
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
				userdata : sampleAdmin
			};

			var entry, entryView;

			beforeEach(function() {
					entry = new Backbone.Model(sample_entry);
					entryView = new Guestbook.Entry({ model: entry});
					entryView.render();
			});


			describe("regular user scenario", function() {

				beforeEach(function() {
					localStorage.removeItem("userdata");
				});

			});

			describe("admin scenario", function() {

				beforeEach(function() {
					localStorage.setItem("userdata", JSON.stringify(sampleAdmin));
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
						spyOn($, "ajax");
						$(link).click();
						expect(entryView.$el.find(".status")).toHaveHtml("Vänta...");
					});

					it("sets the responseText as error", function() {
						spyOn($, "ajax");
						$(link).click();
						var args = $.ajax.mostRecentCall.args[0];
						var sampleRes = "Foo error msg";
						args.error({responseText : sampleRes});
						expect(entryView.$el.find(".status")).toHaveHtml(sampleRes);
					});

					it("closes on error", function() {
						spyOn($, "ajax");
						$(link).click();
						var args = $.ajax.mostRecentCall.args[0];
						spyOn(entryView, "close");
						args.success();
						expect(entryView.close).toHaveBeenCalled();
					});
				});

			});

		});

	};
});
