chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
	if (typeof request.cookie != "undefined") {
		// Clearing cookies for logout
		console.log(request.clearCookies);
		if (request.cookie == null) {
			if (typeof request.clearCookies != "undefined") {
				console.log("clear");
				chrome.cookies.getAll({
					domain: "tf2center.com"
				}, function (cookies) {
					console.log(cookies);
					for (var i = 0; i < cookies.length; i++) {
						console.log(cookies[i]);
						chrome.cookies.remove({
							url: "http://tf2center.com",
							name: cookies[i].name
						});
					}
				});
				sendResponse({
					farewell: "SUCCESS"
				});
			} else {
				console.log("Unknown request");
			}
		} else {
			// Setting saved cookies
			var cookies = request.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				var split = cookies[i].split("=");
				for (var j = 0; j < split.length; j++) {
					split[j] = split[j].replace(" ", "");
				}
				var details = {
					url: "https://tf2center.com/",
					name: split[0].replace(" ", ""),
					value: split[1].replace(" ", "")
				}
				if (split[0] == "JSESSIONID") {
					details["domain"] = "tf2center.com";
				}
				if (split[0] == "cf_only") {
					details["httpOnly"] = true;
				}
				//console.log(details);
				chrome.cookies.set(details);
			}
			sendResponse({
				farewell: "SUCCESS"
			});
		}
	}
	sendResponse({
		farewell: "ERROR"
	});
});
