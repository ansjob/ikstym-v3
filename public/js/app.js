define(["marionette", "backbone", "router"], 
	function(Marionette, Backbone, Router) {
	var App = new Marionette.Application();

	App.addInitializer(function(options) {
		new Router();
		Backbone.history.start();
	});
	return App;
});
