define([
	"require_config"
], function() {

	require([
		"specs/login-page",
		"specs/router",
		"specs/hash_util"
	], function(
		LoginTest,
		RouterTest,
		HashUtilTest
	) {
		LoginTest();
		RouterTest();
		HashUtilTest();

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
