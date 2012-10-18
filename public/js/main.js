require([
	"require_config"
], function() {

	require(["app", "bootstrap"],
	function(App, _) {
		App.start();
	});
});
