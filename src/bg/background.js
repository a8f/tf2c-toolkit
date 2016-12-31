chrome.extension.onRequest.addListener(function (request, sender) {
	var cookies;
	if (request.cookie == null) {
		chrome.cookies.getAll({
			url: "tf2center.com"
		}, function (oldCookies) {
			cookies = oldCookies;
		});
	} else {
		var cookies = request.cookie.split(";");
	}
	for (int i = 0; i < cookies.length; i++) {
		chrome.cookies.set(cookies[i], function (cookie) {
			console.log(cookie);
		});
	}
});
