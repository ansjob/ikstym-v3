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
				var data = {};
				data.message = this.$el.find("form").find("#gb-input").val();
				if (localStorage.getItem("userdata")) {
					var req = new GuestbookAuthorizedPost({
						message: data.message,
						success: this.postSuccess,
						error: this.postError
					});
					req.execute();
				}

				else {
					data.alias = this.$el.find("form")
						.find("input[name='alias']").val();
					$.ajax({
						url: "/api/guestbook",
						type: "post",
						data: data,
						success : this.postSuccess,
						error: this.postError
					});
				}
			},

			postSuccess : function() {
				console.log("post success!");
			},

			postError: function() {
				console.log("post error!");
			}

		});

		return Guestbook;
	});
