define(["views/login-status-view"], function(AccountStatusView) {
	return function() {

		describe("Login status view", function() {

			describe("login-credentials exist", function() {

				var testUser = {
						username : "testuser123",
						first_name : "Andreas",
						last_name : "Sjöberg",
						hash : "testhash123",
						isAdmin : false
				};

				beforeEach(function() {
					localStorage.setItem("userdata", JSON.stringify(testUser));
				});

				it("sets the full user name in the view", function() {
					var view = new AccountStatusView(testUser);
					view.render();
					expect($(view.el).find("#name").html()).toContain(testUser.last_name);
					expect($(view.el).find("#name").html()).toContain(testUser.first_name);
				});

				
			});

		});
	};
});
