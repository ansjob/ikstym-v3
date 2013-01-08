// Contains utilities for authentication

define(["underscore", "jquery.cookies"], function(_) {
	var Auth = {
		hasUserData : function() {
			return this.getUserData() != undefined;
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
		},

		getUserData : function() {
			var potential_keys = ["username", "password", "first_name", "last_name", "password", "hash", "email", "admin", "nick", "admin"];
			var userData = {};
			for (var i = 0; i < potential_keys.length; ++i) {
				var key = potential_keys[i];
				userData[key] = $.cookie(key);
			}
			if (userData.username && userData.password) {
				return userData;
			} else {
				return undefined;
			}
		},

		clearData : function() {
			var cookies = document.cookie.split(";");
			for(var i=0; i < cookies.length; i++) {
				var equals = cookies[i].indexOf("="),
				name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		},

		saveUserDetails : function(userdata) {
			for (var key in userdata) {
				$.cookie(key, userdata[key]);
			}
		},

		isAdmin : function() {
			var data = this.getUserData();
			if (data == undefined) return false;
			if (typeof(data.admin) === "string" 
				&& data.admin.toLowerCase() == 'false') 
				return false;
			return data.admin;
		}
	};

	_.bindAll(Auth);

	return Auth;
});
