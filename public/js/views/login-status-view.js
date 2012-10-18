define(
	[
		"marionette",
		"underscore",
		"text!templates/login-status-view.html"
	], 
	function(Marionette, _, template) {

	template = _.template(template);

	var LoginStatusView = Marionette.View.extend({

		tagName: "div",

		initialize: function(userdata) {
			this.userdata = userdata;
		},

		render: function() {
			this.$el.html(template(this.userdata));
		}

	});

	return LoginStatusView;
});
