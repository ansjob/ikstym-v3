define(["auth"], function(Auth) {
	return function() {

		describe("Authentication Utilities", function() {
			var sampleUser = {
				username : "ansjob",
				password : "somehash123",
				email : "ansjob@kth.se",
				admin : true
			};
			describe("Has User Data", function() {
				beforeEach(function() {
					$.cookie("userdata", JSON.stringify(sampleUser));
				});

				afterEach(function() {
					$.removeCookie("userdata");
				});

				it("has the user data as a cookie", function() {
					var fromCookie = $.parseJSON($.cookie("userdata"));
					expect(sampleUser).toEqual(fromCookie);
				});

				it("indicates there is a user", function() {
					expect(Auth.hasUserData()).toBeTruthy();
				});

				describe("Validating with server", function() {
					beforeEach(function() {
						spyOn($, "ajax");
						Auth.validate();
					});

					it("calls the apropriate URL", function() {
						var args = $.ajax.mostRecentCall.args[0];
						expect(args.url).toEqual("/api/login");
					});

				});
			});

			describe("Has No User Data", function() {
				beforeEach(function() {
					$.removeCookie("userdata");
				});

				it("indicates that the userdata is not there", function() {
					expect(Auth.hasUserData()).toBeFalsy();
				});

				describe("Validating with async method", function() {
					var errorSpy;
					beforeEach(function() {
						errorSpy = jasmine.createSpy();
						spyOn($, "ajax");
						Auth.validate({error : errorSpy});
					});

					it("calls the error spy", function() {
						expect(errorSpy).toHaveBeenCalled();
					});

					it("does not make a call to $.ajax", function() {
						expect($.ajax).not.toHaveBeenCalled();
					});
				});
			});

			describe("Has Falsy User Data", function() {
				beforeEach(function() {
					$.cookie("userdata", "{dfasdsdagf : asdasdasdfg \\\newfsdf\n'''\"}");
				});

				it("indicates that the userdata is not there", function() {
					expect(Auth.hasUserData()).toBeFalsy();
				});

			});

		});
	};
});
