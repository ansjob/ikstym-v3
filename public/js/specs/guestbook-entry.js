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

			it("has the text message in a special box", function() {
				expect(entryView.$el.find(".guestbookcontent").find("div").html().trim())
					.toEqual(sample_entry.text);
					
			});

		});

	};
});
