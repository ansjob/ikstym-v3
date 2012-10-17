define(["lib/hmac-sha512"], function() {

	var Utils = {

		hash: function(string) {
			var salt = "2265256663453634667346", key = "ikstymfirstkey001";
			return CryptoJS.HmacSHA512(string + salt, key).toString(CryptoJS.enc.Hex);
		}

	};

	return Utils;
});
