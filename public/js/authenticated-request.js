define(["backbone"], function(Backbone) {

	var AuthRequest = Backbone.Model.extend({

		defaults: {
			success: function() {},
			error : function() {}
		},

		initialize : function(options) {
			var userdata = $.parseJSON(localStorage.getItem("userdata"));
			this.userdata = userdata;
		},

		execute : function() {
			var data = this.get("data") || {};
			data.username = this.userdata.username;
			data.hash = this.userdata.hash;
			$.ajax({
				url : this.get("url"),
				type: this.get("type"),
				data: data,
				success : this.get("success"),
				error: this.get("error")
			});
		}
	}); 

	return AuthRequest;

});
