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

	var sampleUserData = {
		"username": "ansjob",
		"first_name": "Andreas",
		"last_name": "Sjöberg",
		"hash" : "somehash876576",
		"email": "ansjob@kth.se",
		"phone": 123456,
		"nick": "Sjöberg",
		"admin": true,
		"locked": false
	};

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

				describe("no user data", function() {

					var aliasInput;

					beforeEach(function() {
						localStorage.removeItem("userdata");
						gb.render();
						aliasInput = gb.$el.find("form").find("input[name='alias']");
					});

					it("has an alias input", function() {
						expect(aliasInput.length).toEqual(1);
					});

					it("posts the alias to ajax", function() {
						var alias = "some-alias";
						aliasInput.val(alias);
						spyOn($, "ajax");
						gb.$el.find("form").submit();
						var args = $.ajax.mostRecentCall.args[0];
						expect(args.data.alias).toEqual(alias);
					});

				});

				describe("userdata exists", function() {

					beforeEach(function() {
						localStorage.setItem("userdata", JSON.stringify(sampleUserData));
						gb.render();
					});

					it("has no alias input", function() {
						expect(
							gb.$el.find("form").find("input[name='alias']").length
						).toEqual(0);
					});

					it("has a link to the user's profile instead", function() {
						expect(gb.$el.find("form").find("#alias-container").
							find("a").attr("href"))
						.toEqual("#user/" + sampleUserData.username);
					});

					it("posts the username and hash", function() {
						spyOn($, "ajax");
						var entry = "some message posted in the guestbook";
						gb.$el.find("#gb.input").html(entry);
						gb.$el.find("form").submit();
						var args = $.ajax.mostRecentCall.args[0];
						expect(args.data.username).toEqual(sampleUserData.username);
						expect(args.data.hash).toEqual(sampleUserData.hash);
					});

				});


			});


		});
	};
});
