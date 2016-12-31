chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
			if (document.readyState === "complete") {
				clearInterval(readyStateCheckInterval);
				injectScript(chrome.extension.getURL('/src/inject/inject.js'), 'body');
				chrome.storage.sync.get("users", function (items) {
					// Add users to menu
					var users = items;
					var newEle;
					var newUser = false;
					if (!$(".playerTopMenu ul:first").length) {
						newEle = document.createElement('ul');
						$(".playerTopMenu").append(newEle);
					}
					if (typeof users === "undefined") {
						newUser = true;
					} else {
						for (var i = 0; i < users.length; i++) {
							if (users[i].id == getID()) {
								newUser = true;
							} else {
								newEle = document.createElement('li');
								newEle.innerHTML = "<div class=\"icons navbarmenu prefs\"></div><a href=\"#\">" + users[i].name + "</a>";
								$(".playerTopMenu ul:first").append(newEle).on("click", loadSession, user[i].session);
							}
						}
					}

					if (newUser) {
						newEle = document.createElement('li');
						newEle.innerHTML = "<div class=\"icons navbarmenu prefs\"></div><a href=\"#\">Save account</a>";
						$(".playerTopMenu ul:first").append(newEle).on("click", function () {
							saveCurrentUser();
							location.reload();
						});
					}

					$(".playerTopMenu").on("click", function () {
						expandOptions(typeof users === "undefined" ? 0 : users.length);
					});
					$(".speechBubble").css("z-index", 0);
				});
			}
		}, 10);

});

// User prototype
function User(name, id, session) {
	this.name = name;
	this.id = id;
	this.session = session;
}

// Never returns
function loadSession(newCookie) {
	chrome.extension.sendRequest({
		cookie: newCookie
	});
	location.reload();
}

function expandOptions(userCount) {
	console.log(userCount);
	$(".playerTopMenu").toggleClass("active");
	if ($(".playerTopMenu").is(".active")) {
		$(".playerTopMenu .icons.carrot.grey").removeClass("down").addClass("up");
		$(".playerTopMenu").animate({
			height: 137 + 30 * (userCount + 1) + "px"
		}, 200);
	} else {
		$(".playerTopMenu .icons.carrot.grey").removeClass("up").addClass("down");
		$(".playerTopMenu").animate({
			height: "45px"
		}, 200);
	}
	$(".speechBubble").css("z-index", 0);
}

function saveSessionAndLogout() {
	saveCurrentUser();
	loadSession(null);
}

function injectScript(file, node) {
	var th = document.getElementsByTagName(node)[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	th.appendChild(s);
}

function saveCurrentUser() {
	var users;
	chrome.storage.sync.get("users", function (items) {
		users = items;

		if (typeof users === "undefined") {
			users = [];
		}

		var found = false;
		for (var i = 0; i < users.length; i++) {
			if (users[i].id == getID()) {
				users[i].name = getName();
				users[i].session = document.cookie;
				found = true;
			}
		}
		if (!found) {
			var newUser = new User(getName(), getID(), document.cookie);
			users.push(newUser);
		}
		chrome.storage.sync.set({
			'users': users
		}, function () {});
	});

}

function updateCurrentUser() {
	chrome.storage.sync.get("users", function (items) {
		if (!chrome.runtime.error) {
			users = items;
			var changed = false;
			for (var i = 0; i < users.length; i++) {
				if (users[i].id == getID()) {
					users[i].name = getName();
					users[i].session = document.cookie;
					changed = true;
				}
			}
			if (changed) {
				chrome.storage.sync.set({
					'users': users
				}, function () {});
			}
		}
	});
}

function deleteUser(user) {
	chrome.storage.sync.get("users", function (items) {
		if (!chrome.runtime.error) {
			users = items;
			for (var i = 0; i < users.length; i++) {
				if (users[i].id == getID()) {
					users.splice(i, 1);
				}
			}
			chrome.storage.sync.set({
				'users': users
			}, function () {});
		}
	});
}

function getName() {
	return $(".playerTopName").text();
}

function getID() {
	var steamid = $('a:contains("Profile"):first').attr("href");
	if (typeof steamid === "undefined") {
		return undefined;
	}
	return steamid.split("/")[2];
}
