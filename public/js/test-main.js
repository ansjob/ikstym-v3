define([
	"require_config"
], function() {

	require([
		"specs/login-page",
		"specs/router",
		"specs/hash_util",
		"specs/local-storage",
		"specs/authenticated-requests",
		"specs/login-status-view"
	], function(
		LoginTest,
		RouterTest,
		HashUtilTest,
		LocalStorageTest,
		AuthenticatedRequestsTest,
		LoginStatusViewTest
	) {
		LoginTest();
		RouterTest();
		HashUtilTest();
		LocalStorageTest();
		AuthenticatedRequestsTest();
		LoginStatusViewTest();

		var jasmineEnv = jasmine.getEnv();
		jasmineEnv.updateInterval = 1000;
		var htmlReporter = new jasmine.HtmlReporter();
		jasmineEnv.addReporter(htmlReporter);
		jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};

	jasmineEnv.execute();

	});
});
