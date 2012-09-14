exports.mappings = [ 
	{
		method: "get",
		route: "/api/version",
		callback: function(req, res) {
			res.send("3.0.0");
		}
	},

	{
	}
];
