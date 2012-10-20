define(["views/guestbook-page", "marionette", "backbone"], 
	function(Guestbook, Marionette, Backbone) {
	var sampleEntries = [
  {
    "id": 3,
    "timestamp": 12345,
    "alias": "some guy",
    "text": "hej ik!",
    "ip": "123.543.123.123",
    "username": null
  },
  {
    "id": 2,
    "timestamp": 12345,
    "text": "hej igen gästboken, din gamle skurk!",
    "ip": "123.543.123.123",
    "userdata": {
      "username": "ansjob",
      "first_name": "Andreas",
      "last_name": "Sjöberg",
      "email": "ansjob@kth.se",
      "phone": 123456,
      "nick": "Sjöberg",
      "admin": true,
      "locked": false
    }
  },
  {
    "id": 1,
    "timestamp": 12345,
    "text": "hej gästboken!",
    "ip": "123.543.123.123",
    "userdata": {
      "username": "ansjob",
      "first_name": "Andreas",
      "last_name": "Sjöberg",
      "email": "ansjob@kth.se",
      "phone": 123456,
      "nick": "Sjöberg",
      "admin": true,
      "locked": false
    }
  }
];
	return function() {
		describe("Guestbook", function() {

			var collection, gb, vent;

			beforeEach(function() {
				vent = new Marionette.EventAggregator();
				collection = new Backbone.Collection(sampleEntries);
				gb = new Guestbook();
			});

			it("is defined", function() {
				expect(Guestbook).toBeDefined();
			});

			it("starts out with a loading message", function() {
				gb.render();
				expect(gb.$el.find("#message").html()).toContain("Laddar");
			});

			it("makes a call to fetch the collection on render", 
			function() {
				spyOn($, "ajax");
				gb.render();
				var args = $.ajax.mostRecentCall.args[0]; 
				expect(args.data.page).toEqual(1);
			});

			it("renders the items when the ajax callback is issued", function() {
				spyOn($, "ajax");
				gb.render();
				var args = $.ajax.mostRecentCall.args[0]; 
				args.success(sampleEntries);
				expect(gb.$el.find(".entry").length).toEqual(sampleEntries.length);
			});

			it("removes the loading message when the ajax callback is issued", function() {
				spyOn($, "ajax");
				gb.render();
				var args = $.ajax.mostRecentCall.args[0]; 
				args.success(sampleEntries);
				expect(gb.$el.find("#message").html()).toEqual("");
			});

			describe("the submission form", function() {
				beforeEach(function() {
					gb.render();
				});

				it("exists", function() {
					expect($(gb.$el).find("form").length).toEqual(1);
				});

				it("hooks into form submit events", function() {
					spyOn(gb, "onSubmit");
					$(gb.$el.find("form")).submit();
					expect(gb.onSubmit).toHaveBeenCalled();
				});

			});


		});
	};
});
