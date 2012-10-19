define([
	"marionette", 
	"text!templates/login-page.html", 
	"views/error_dialog",
	"utils"], 
	function(Marionette, template, ErrorDialog, utils) {


		var DEBUG_LEVEL = 0;

		var DEBUG = function(level, message) {
			if (level <= DEBUG_LEVEL) {
				console.log("[LOGIN VIEW] " + message);
			}
		};

		var LoginView = Marionette.View.extend({
			tagName: "div",

			initialize: function(options) {
				_.bindAll(this);
				this.vent = options.vent;
			},

			render: function() {
				DEBUG(2, "rendering!");
				localStorage.removeItem("userdata");
				this.vent.trigger("logout");
				this.$el.html(template);
				var form = this.$el.find("form")[0];
				var that = this;
				form.onsubmit = function(ev) {
					ev.preventDefault();
					that.onFormSubmit();
				};
			},

			onFormSubmit : function() {
					if (this.formLocked) return;
					var username = this.$el.find("input[name='username']").val(),
						password = this.$el.find("input[name='password']").val();
					var hash = utils.hash(password);
					this.username = username;
					this.hash = hash;
					this.lockForm();

					DEBUG(3, "Username entered: " + username);
					DEBUG(3, "Hash calculated: " + hash);

					$.ajax({
						type : "POST",
						url : "api/login",
						data : {
							username: username,
							hash : hash
						},
						success: this.onLoginSuccess,
						error: this.onLoginFail
					});
			},

			onLoginSuccess : function(data) {
				DEBUG(1, "Login Successful!");
				this.clearErrorMessage();
				data.hash = this.hash;
				this.vent.trigger("login:success", data);
				this.unlockForm();
			},

			onLoginFail : function(result) {
				DEBUG(1, "Login failed!");
				switch(result.status) {
					case 404:
						this.renderPageNotFound();
						break;
					case 401:
						this.renderAccessDenied();
						break;
					default:
						this.renderGenericError();
				}
				this.unlockForm();
			},

			clearErrorMessage : function() {
				this.$el.find("#error").html('');
			},

			renderPageNotFound : function() {
				var errorMessage = "404! Du försökte ladda en sida som inte fanns." +
					" Detta kan bero på ett programmeringsfel!";
				var errorDialog = new ErrorDialog({message: errorMessage});
				errorDialog.show();
			},

			renderAccessDenied : function() {
				var errorMessage = "Fel användarnamn eller lösenord." + 
					" Försök igen eller begär ett nytt lösenord skickat till din mail";
				this.setErrorMessage(errorMessage);
			},

			renderGenericError: function() {
				var errorMessage = "Något gick fel vid inloggningen. " + 
					"Försök igen senare, eller kontakta admin om problemet kvarstår.";
				this.setErrorMessage(errorMessage);
			},

			setErrorMessage : function (msg) {
				this.$el.find("#error").html(msg);
			},

			lockForm : function() {
				this.$el.find("button").attr("disabled", "disabled");
				this.formLocked = true;
			},

			unlockForm : function() {
				this.$el.find("button").attr("disabled", "");
				this.formLocked = false;
			}
		});

		return LoginView;
	});
