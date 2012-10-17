define(["router", "backbone", "views/login-page", "marionette"], 

	function(Router, Backbone, LoginView, Marionette) {

	return function() {

	describe("router", function() {

		var vent = new Marionette.EventAggregator();
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
	});

	};
});
