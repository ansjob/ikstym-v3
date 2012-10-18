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
			$.ajax({
				url : this.get("url"),
				type: this.get("type"),
				data: {
					username : this.userdata.username,
					hash : this.userdata.hash,
				},
				success : this.get("success"),
				error: this.get("error")
			});
		}
	}); 

	return AuthRequest;

});
