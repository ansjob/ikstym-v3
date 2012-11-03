define([
	"backbone", 
	"marionette",
	"underscore",
	"authenticated-request",
	"text!templates/guestbook.html",
	"text!templates/guestbook-entry.html"
	], 
	function(Backbone, Marionette, _, AuthorizedRequest, gb_template, entry_template) {

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

		var GuestbookAuthorizedPost = AuthorizedRequest.extend({
			defaults: {
				type: "post",
				url: "/api/guestbook"
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

				var inputContainer = this.$el.find("form").find("#alias-container");
				var userData = localStorage.getItem("userdata");
				if (userData) {
					userData = $.parseJSON(userData);
					$(inputContainer).html("Postar som " + 
					"<a href=\"#user/" + userData.username + "\">" + 
						userData.nick + 
					"</a>");
				}

				var that = this;
				var form = this.$el.find("form")[0];
				form.onsubmit = function(submitEvent) {
					submitEvent.preventDefault();
					that.onSubmit();
				};
			},

			onSubmit : function() {

				this.$el.find("#message").html("");
				var data = {};
				data.message = this.$el.find("form").find("#gb-input").val();

				if (!data.message) {
					this.$el.find("#message").html(
					"Ett längre meddelande än så kan du nog skriva..."
					);
					return;
				}
				this.lockForm();
				if (localStorage.getItem("userdata")) {
					var req = new GuestbookAuthorizedPost({
						data: data,
						success: this.postSuccess,
						error: this.postError
					});
					req.execute();
				}

				else {
					data.alias = this.$el.find("form")
						.find("input[name='alias']").val();
					if (!data.alias) {
						this.$el.find("#message").html(
							"Glöm inte att skriva in ditt namn!"
						);
						return;
					}
					var that = this;
					$.ajax({
						url: "/api/guestbook",
						type: "post",
						data: data,
						success : function() {that.postSuccess(arguments);},
						error: function() {that.postError(arguments);}
					});
				}
			},

			postSuccess : function() {
				this.unlockForm();
			},

			postError: function() {
				this.unlockForm();
			},

			lockForm : function() {
				this.$el.find("form").find("input").attr("disabled", "disabled");
				this.$el.find("form").find("textarea").attr("disabled", "disabled");
			},

			unlockForm : function() {
				this.$el.find("form").find("input").removeAttr("disabled");
				this.$el.find("form").find("textarea").removeAttr("disabled");
			}

		});

		return Guestbook;
	});
