define([
	"backbone", 
	"marionette",
	"underscore",
	"text!templates/guestbook.html",
	"text!templates/guestbook-entry.html"
	], 
	function(Backbone, Marionette, _, gb_template, entry_template) {

		var entry_t = _.template(entry_template);

		var Entry = Marionette.ItemView.extend({

			template : entry_template,
			tagName: "div",

			initialize: function() {
				var userdata = this.model.get("userdata");
				if (userdata) {
					this.model.set("alias", 
					"<a href = \"#user/" + userdata.username + "\">" + 
					userdata.nick + "</a>");
				}
			},

			render: function() {
				Marionette.ItemView.prototype.render.apply(this);
				this.$el.addClass("entry").html(entry_t(this.model.toJSON()));
			}
		}); 

		var GuestbookCollection = Backbone.Collection.extend({
			url: "/api/guestbook"
		});

		var Guestbook = Marionette.CompositeView.extend({
			tagName: "div",
			itemView : Entry,
			template: gb_template,

			initialize: function() {
				_.bindAll(this);
				this.collection = new GuestbookCollection(); 
				this.bindEvents();
			},

			bindEvents : function() {
				var that = this;
				this.collection.on("reset", function() {
					that.$el.find("#message").html("");
				});
			},

			render: function() {
				this.collection.fetch({
					data: {page: 1}
				});
				Marionette.CompositeView.prototype.render.apply(this);
			}

		});

		return Guestbook;
	});
