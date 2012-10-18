define(["authenticated-request"],
	function(AuthenticatedRequest) {

		return function() {

		describe("Authenticated Requests", function() {

			describe("no data saved scenarios",
			function() {

				beforeEach(function() {
					localStorage.setItem("userdata", undefined);
				});

				it("throws an exception when created", function() {
					expect(function() {
						var req = new AuthenticatedRequest({
							url : "test",
							type : "post"
						});
					}).toThrow();
				});
			});

			describe("userdata saved scenarios", function(){
				beforeEach(function() {
					localStorage.setItem("userdata", JSON.stringify({
						username : "testuser123",
						hash : "hashvalue123",
						isAdmin : true
					}));
				});

				afterEach(function() {
					localStorage.setItem("userdata", undefined);
				});

				it("does not throw an exception when instantiated", function() {
					expect(function() {
						var req = new AuthenticatedRequest({
							url : "test",
							type : "post"
						});
					}).not.toThrow();
				});

				it("makes the correct ajax request", function() {
					var req = new AuthenticatedRequest({
						url : "testurl",
						type : "put"
					});
					spyOn($, "ajax");
					req.execute();
					var args = $.ajax.mostRecentCall.args[0];
					expect(args.url).toEqual("testurl");
					expect(args.type).toEqual("put");
					expect(args.data).toEqual({
						username : "testuser123",
						hash : "hashvalue123"
					});
				});

				it("is extendable", function() {
					var PostGuestbookRequest = AuthenticatedRequest.extend({
						defaults: {
							url : "guestbook",
							type: "post"
						}
					});

					var req = new PostGuestbookRequest();
					spyOn($, "ajax");
					req.execute();
					var args = $.ajax.mostRecentCall.args[0];
					expect(args.url).toEqual("guestbook");
					expect(args.type).toEqual("post");
					expect(args.data).toEqual({
						username : "testuser123",
						hash : "hashvalue123"
					});
				});

				describe("forwards callbacks to ajax", function() {
					var calledsuccess, callederror, req, args;
					beforeEach(function() {
						calledsuccess = callederror = false;
						req = new AuthenticatedRequest({
							success : function() { calledsuccess = true;},
							error : function() { callederror = true;},
							url : "someurl",
							type : "post"
						});
						spyOn($, "ajax");
						req.execute();
						args = $.ajax.mostRecentCall.args[0];
					});

					it("calls the success callback", function() {
						args.success();
						expect(calledsuccess).toBeTruthy();
					});

					it("calls the error callback", function() {
						args.error();
						expect(callederror).toBeTruthy();
					});
				});
			}); 
		});
		};
	});
