define([
	"auth",
	"marionette", 
	"backbone", 
	"router", 
	"underscore", 
	"views/login-status-view"
	], 
	function(Auth, Marionette, Backbone, Router, _,
		LoginStatusView) {

	var IKApp = Marionette.Application.extend({
		initializer : function(options) {
			_.bindAll(this);
		},

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

	var guestbook_entries = new Backbone.Collection({
		url : "/api/guestbook"
	});

	var renderUserInfoView = function(options) {
		if (Auth.hasUserData()) {
			var view = new LoginStatusView(Auth.getUserData());
			view.render();
			statusRegion.show(view);
		}
	};
	var hideUserInfoView = function() {
		statusRegion.reset();
	};

	App.addInitializer(renderUserInfoView);


	App.vent.on("login:success", function(userdata) {
		Auth.saveUserDetails(userdata);
		renderUserInfoView();
		$("#loginlink").html("Logga ut").attr("href", "#logout");
	});

	App.vent.on("logout", function() {
		Auth.clearData();
		hideUserInfoView();
		$("#loginlink").html("Logga in").attr("href", "#login");
	});

	App.addInitializer(function(options) {

		
		if (Auth.hasUserData()) $("#loginlink").html("Logga ut").attr("href", "#logout");

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
