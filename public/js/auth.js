// Contains utilities for authentication

define(["underscore", "jquery.cookies"], function(_) {
	var Auth = {
		hasUserData : function() {
			var userData = $.cookie("userdata");
			if (userData) {
				try {
					userData = $.parseJSON(userData);
					return userData.username && userData.password;
				} catch (e) {
					return false;
				}
			} else {
				return false;
			}
		},

		validate : function(opts) {
			if (!this.hasUserData()) {
				opts.error({
					responseText : "Det fanns ingen användardata att validera"
				});
			}
			else {
				opts = opts || {};
				opts.url = "/api/login";
				$.ajax(opts);
			}
		}
	};

	_.bindAll(Auth);

	return Auth;
});
