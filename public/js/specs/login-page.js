define(["auth", "views/login-page", "marionette", "utils"], 
	function(Auth, LoginView, Marionette, Utils) {

	return function() {

	describe("login-page", function() {


		var vent;
		beforeEach(function() {
			vent = new Marionette.EventAggregator();
		});

		describe("no userdata exists scenarios", function() {
			var loginView;

			beforeEach(function() {
				Auth.clearData();
				loginView = new LoginView({
					vent: vent
				});
				loginView.render();
			});

			afterEach(function() {
				loginView.remove();
				vent.unbindAll();
			});

			it("exists", function() {
				expect(LoginView).toBeDefined();
			});

			it("renders a form", function() {
				var formSelectResults = $(loginView.el).find("form");
				expect(formSelectResults.length).toEqual(1);
			});

			describe("connection successful scenarios", function() {

				it("hooks into the form being submitted", function() {
					spyOn(loginView, 'onFormSubmit');
					$(loginView.el).find("form").submit();
					expect(loginView.onFormSubmit).toHaveBeenCalled();
				});

				it("supplies the username and hash-value in the ajax call", function() {
					spyOn($, "ajax");
					var username = "testuser";
					var password = "testpassw";
					var testhash = Utils.hash(password); 
					$(loginView.el).find("input[name='username']").val(username);
					$(loginView.el).find("input[name='password']").val(password);
					$(loginView.el).find("form").submit();
					var args = $.ajax.mostRecentCall.args[0];
					expect(args.data).toEqual({
						username: username,
						hash : testhash
					});
					expect(args.url).toEqual("api/login");
				});

				it("triggers a login:successful event when 200 is returned", function() {
					spyOn($, "ajax");
					var triggered = false;
					vent.on("login:success", function() {
						triggered = true;
					});
					$(loginView.el).find("form").submit();
					var args = $.ajax.mostRecentCall.args[0];
					args.success({isAdmin: true}); 
					expect(triggered).toBeTruthy();
				});

				it("displays an error message when a 401 is returned", function() {
					spyOn($, "ajax");
					$(loginView.el).find("form").submit();
					var args = $.ajax.mostRecentCall.args[0];
					args.error({status: 401});
					var loginFailedMsg = $(loginView.el).find("#error").html();
					expect(loginFailedMsg).not.toEqual("");
				});

			});

			describe("connection error scenario", function() {
				var args;
				beforeEach(function() {
					spyOn($, "ajax");
					$(loginView.el).find("form").submit();
					args = $.ajax.mostRecentCall.args[0];
				});

				it("renders an error message on timeouts", function() {
					args.error({status : 408}, "timeout");
					var loginFailedMsg = $(loginView.el).find("#error").html();
					expect(loginFailedMsg).not.toEqual("");
				});
			});
		});

		describe("userdata exists-scenarios", function() {
			var view;
			var userData = {
				username : "testuser",
				password : "test123",
				first_name : "Test",
				last_name : "Testsson",
				email: "email@test.se",
				nick: "TestArn"
			};
			beforeEach(function() {
				Auth.saveUserDetails(userData);
				view = new LoginView({
					vent: vent
				});
			});

			it("deletes the contents in the cookies", function() {
				view.render();
				expect(Auth.hasUserData()).toBeFalsy();
			});

			it("triggers a logout", function() {
				var triggered = false;
				vent.on("logout", function() {
					triggered = true;
				});
				view.render();
				expect(triggered).toBeTruthy();
			});
		});

	});

	};
});
