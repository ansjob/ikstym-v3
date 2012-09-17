define(["marionette", "jquery", "text!templates/login-page.html"], 
	function(Marionette, $, template) {

		var LoginView = Marionette.View.extend({
			el: "div",
			render: function() {
				this.$el.html(template);
			}
		});

		return LoginView;
	});
