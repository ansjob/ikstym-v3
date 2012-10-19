define(
	[
		"marionette",
		"underscore",
		"text!templates/login-status-view.html",
		"text!templates/login-status-view-not-logged-in.html"
	], 
	function(Marionette, _, template, no_auth_template) {

	template = _.template(template);

	var LoginStatusView = Marionette.View.extend({

		tagName: "div",

		initialize: function(userdata) {
			this.userdata = userdata;
		},

		render: function() {
			if (this.userdata)
				this.$el.html(template(this.userdata));
			else
				this.$el.html(no_auth_template);
			this.$el.addClass("row alert");
		}

	});

	return LoginStatusView;
});
