chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");
	if (typeof request.cookie != "undefined") {
		var cookies;
		// Clearing cookies for logout
		if (cookie == null) {
			cookies = chrome.cookies.getAll({
					url: "https://tf2center.com"
				}, function (savedCookies) {
					for (var i = 0; i < savedCookies.length; i++) {
						chrome.cookies.remove(savedCookies[i]);
					}
				});
		}
		// Setting saved cookies
		cookies = request.cookie.split(";");
		console.log(cookies);
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

	sendResponse({
		farewell: "ERROR"
	});
});
/*chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
console.log(sender.tab ?
"from a content script:" + sender.tab.url :
"from the extension");

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
});
}

});

*/
