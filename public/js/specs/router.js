define(["router", "backbone", "marionette",
		"views/login-page",
		"views/start-page",
		"views/error_dialog"
		], 

	function(Router, Backbone, Marionette,
		LoginView,
		StartView,
		ErrorDialog) {

	return function() {

	describe("router", function() {

		var vent = new Marionette.EventAggregator();
		var router;
		beforeEach(function() {
			var region = new Backbone.Marionette.Region({
				el : "#test-main"
			});

			var modalRegion = new Backbone.Marionette.Region({
				el: "#test-modal"
			});
			router = new Router({
				'mainRegion' : region,
				'modalRegion' : modalRegion,
				vent : vent
			});
			router.start();
			router.navigate("");
		});

		afterEach(function() {
			router.navigate("");
			router.stop();
		});

		it("has a navigate method", function() {
			expect(typeof(router.navigate)).toEqual("function");
		});

		it("renders the login page", function() {
			spyOn(LoginView.prototype, 'render');
			router.navigate("login", {trigger: true});
			expect(LoginView.prototype.render).toHaveBeenCalled();
		});

		it("clears error messages between renders", function() {
			spyOn(router, 'clearErrors');
			router.navigate("login", true);
			expect(router.clearErrors).toHaveBeenCalled();
		});

		it("renders the start page", function() {
			spyOn(StartView.prototype, 'render');
			router.navigate("login", true);
			router.navigate("", true);
			expect(StartView.prototype.render).toHaveBeenCalled();
		});

		it("renders an error dialog when illegal routes are entered", function() {
			spyOn(ErrorDialog.prototype, 'show');
			router.navigate("some-illegal-route", true);
			expect(ErrorDialog.prototype.show).toHaveBeenCalled();
		});

		it("renders the start page upon a successful login", function() {
			var userDetails = {
				username : "testuser",
				hash : "hashcode123456"
			};
			router.navigate("login");
			spyOn(router, "navigate");
			vent.trigger("login:success", userDetails); 
			var args = router.navigate.mostRecentCall.args;
			expect(args[0]).toEqual("");
			expect(args[1]).toEqual(true);
		});

	});

	};
});
