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

		var GuestbookAuthorizedPost = AuthorizedRequest.extend({
			defaults: {
				type: "post",
				url: "/api/guestbook"
			}
		});

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
				var user_data = $.parseJSON(localStorage.getItem("userdata"));
				if (user_data && user_data.admin) {
					this.$el.find(".ip-holder").html("IP:" + this.model.get("ip"));
					var deleteLink = this.deleteLink();
					this.$el.find(".delete-holder").html(deleteLink);
				}
			},

			deleteLink : function() {
				var link = document.createElement("a");
				var that = this;
				$(link).html("Ta bort")
					.addClass("delete")
					.attr("href", "#guestbook")
					.click(function() {
						that.setStatus("Vänta...");
						that.model.destroy({
							error : function(model, response) {
								that.setStatus(response.responseText);
							},
							success : function(model, response) {
								that.close();
							},
							wait : true
						});
					});

				return link;
			},

			setStatus : function(msg) {
				$(this.el).find(".status").html(msg);
			}
		}); 


		var GuestbookCollection = Backbone.Collection.extend({
			url: "/api/guestbook",
			fetch: function() {
				if (arguments.length == 0) arguments = [{data: {}}];
				var userdata = localStorage.getItem("userdata");
				if (userdata) {
					userdata = $.parseJSON(userdata);
					if (userdata.admin) {
						arguments[0].data.username = userdata.username;
						arguments[0].data.hash = userdata.hash;
					}
				}
				Backbone.Collection.prototype.fetch.apply(this, arguments);
			}
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
					that.clearErrorMessage();
				});
			},

			render: function() {

				var userData = $.parseJSON(localStorage.getItem("userdata"));
				var fetchParameters = {
					page: 0
				};
				if (userData) {
					fetchParameters.username = userData.username;
					fetchParameters.hash = userData.hash;
				}
				this.collection.fetch({
					data: fetchParameters 
				});
				Marionette.CompositeView.prototype.render.apply(this);

				var inputContainer = this.$el.find("form").find("#alias-container");
				if (userData) {
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

				this.clearErrorMessage();
				var data = {};
				data.message = this.$el.find("form").find("#gb-input").val();

				if (data.message.trim().length < 2) {
					this.showErrorMessage(
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
						.find("input[name='alias']").val().trim();
					if (!data.alias) {
						this.showErrorMessage("Glöm inte att skriva in ditt namn!");
						this.unlockForm();
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
				this.collection.fetch();
				this.unlockForm();
			},

			postError: function() {
				this.unlockForm();
			},

			clearErrorMessage : function() {
				this.$el.find("#message").html("").hide();
			},

			showErrorMessage : function(msg) {
				this.$el.find("#message").html(msg).show();
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

		Guestbook.Entry = Entry;

		return Guestbook;
	});
