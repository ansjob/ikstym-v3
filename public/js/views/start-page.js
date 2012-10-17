define(
	[
		"marionette",
		"text!templates/start.html"
	],
	function(Marionette, template) {
		var StartView = Marionette.View.extend({

			tagName: "div",

			render: function() {
				this.$el.html(template);
			}

		});

		return StartView;
	});
