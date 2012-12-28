define(["auth", "views/login-status-view"], function(Auth, AccountStatusView) {
	return function() {

		describe("Login status view", function() {

			describe("userdata given", function() {

				var testUser = {
						username : "testuser123",
						first_name : "Andreas",
						last_name : "Sjöberg",
						password : "testhash123",
						isAdmin : false
				};

				beforeEach(function() {
					Auth.saveUserDetails(testUser);
				});

				afterEach(function() {
					Auth.clearData();
				});

				it("sets the full user name in the view", function() {
					var view = new AccountStatusView(testUser);
					view.render();
					expect($(view.el).find("#name").html()).toContain(testUser.last_name);
					expect($(view.el).find("#name").html()).toContain(testUser.first_name);
				});

			});

			describe("no userdata given", function() {

				var view;
				it("renders a message saying not logged in", function() {
					view = new AccountStatusView(undefined);
					view.render();
					expect($(view.el).html()).toContain("Ej inloggad");
				});
			});

		});
	};
});
