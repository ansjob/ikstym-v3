define(["marionette", "text!templates/message.html", "underscore"],
	function(Marionette, template, _) {

		template = _.template(template);
		var ErrorDialog = Marionette.View.extend({
			tagName: "div",

			initialize: function(options) {
				_.bindAll(this);
				this.message = options.message;
				this.headline = options.headline;
				this.region = options.region;
			},

			render: function() {
				var headline = this.headline || "Hoppsan!";
				var message = this.message;
				var html = template({
					message: message,
					headline : headline
				});
				this.$el.html(html);
				this.$el.addClass("alert");
			},

			show : function() {
				this.render();
				this.region.show(this);
				$("html, body").animate({
					scrollTop: $(this.$el).offset().top
				}, 1500);
			}

		});

		return ErrorDialog;
	});
