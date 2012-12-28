define([
	"require_config"
], function() {

	require([
		"specs/login-page",
		"specs/router",
		"specs/hash_util",
		"specs/login-status-view",
		"specs/guestbook",
		"specs/guestbook-entry",
		"specs/auth-utils"
	], function(
		LoginTest,
		RouterTest,
		HashUtilTest,
		LoginStatusViewTest,
		GuestbookTests,
		GuestbookEntryTests,
		AuthUtilTests
	) {
		LoginTest();
		RouterTest();
		HashUtilTest();
		LoginStatusViewTest();
		GuestbookTests();
		GuestbookEntryTests();
		AuthUtilTests();

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
