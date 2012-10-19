define([
	"marionette", 
	"backbone", 
	"router", 
	"underscore", 
	"views/login-status-view"
	], 
	function(Marionette, Backbone, Router, _,
		LoginStatusView) {

	var IKApp = Marionette.Application.extend({
		initializer : function(options) {
			_.bindAll(this);
		},

		saveUserDetails : function(userdata) {
			localStorage.setItem("userdata", JSON.stringify(userdata));
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

	var renderUserInfoView = function(options) {
		var userdata = localStorage.getItem("userdata");
		if (userdata) userdata = $.parseJSON(userdata);
		var view = new LoginStatusView(userdata);
		view.render();
		statusRegion.show(view);
	};

	App.vent.on("login:success", function(userdata) {
		App.saveUserDetails(userdata);
		renderUserInfoView();
		$("#loginlink").html("Logga ut").attr("href", "#logout");
	});

	App.vent.on("logout", function() {
		renderUserInfoView();
		$("#loginlink").html("Logga in").attr("href", "#login");
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


	App.addInitializer(renderUserInfoView);


	return App;
});
