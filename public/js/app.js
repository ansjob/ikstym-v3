define(["marionette", "backbone", "router", "underscore"], 
	function(Marionette, Backbone, Router, _) {

	var IKApp = Marionette.Application.extend({
		initializer : function(options) {
			_.bindAll(this);
		},

		saveUserDetails : function(userdata) {
			localStorage.set("userdata", JSON.stringify(userdata));
		}
	});

	var App = new IKApp();

	var mainRegion = new Backbone.Marionette.Region({
		el : "#main-content"
	});
	var modalRegion = new Backbone.Marionette.Region({
		el : "#modal"
	});
	var statusRegion = new Backbone.Marionette.Region({
		el : "#status"
	});

	App.vent.on("login:success", function(userdata) {
		App.saveUserDetails(userdata);
		var statusView = new StatusView(userdata);
		modalRegion.show(statusView);
	});

	App.addInitializer(function(options) {

		var router = new Router({
			'mainRegion' : mainRegion, 
			'modalRegion' : modalRegion,
			'statusRegion' : statusRegion,
			'vent' : this.vent
		});
		router.start();
	});
	return App;
});
