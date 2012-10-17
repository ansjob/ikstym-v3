define(["views/login-page", "jquery", "marionette"], 
	function(LoginView, $, Marionette) {

	return function() {

	describe("login-page", function() {

		var loginView;
		var vent;

		beforeEach(function() {
			vent = new Marionette.EventAggregator();
			loginView = new LoginView({
				vent: vent
			});
			loginView.render();
		});

		afterEach(function() {
			loginView.remove();
			vent.unbindAll();
		});

		it("exists", function() {
			expect(LoginView).toBeDefined();
		});

		it("renders a form", function() {
			var formSelectResults = $(loginView.el).find("form");
			expect(formSelectResults.length).toEqual(1);
		});

	});

	};
});
