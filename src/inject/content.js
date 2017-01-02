chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
			if (document.readyState === "complete") {
				clearInterval(readyStateCheckInterval);
				injectScript(chrome.extension.getURL('/src/inject/inject.js'), 'body');
				chrome.storage.sync.get("users", function (items) {
					var users = $.map(items, function (value, index) {
							return [value];
						});
					users = users[0];
					var newEle;
					var newUser = true;

					if (!$(".playerTopMenu ul:first").length) {
						newEle = document.createElement('ul');
						$(".playerTopMenu").append(newEle);
					}
					if (typeof users === "undefined") {
						users = [];
					} else {
						for (var i = 0; i < users.length; i++) {
							if (users[i].id == getID()) {
								newUser = false;
							} else {
								newEle = document.createElement('li');
								newEle.innerHTML = "<div class=\"icons navbarmenu prefs tkuser\"></div><a href=\"#\">" + users[i].name + "</a>";
								$(".playerTopMenu ul:first").append(newEle); //.on("click", loadSession, users[i].session)
							}
						}
					}

					if (newUser) {
						newEle = document.createElement('li');
						newEle.innerHTML = "<div class=\"icons navbarmenu prefs\"></div><a href=\"#\">Save account</a>";
						$(".playerTopMenu ul:first").append(newEle).on("click", function () {
							saveCurrentUser();
							window.href = window.location;
						});
					} else {
						newEle = document.createElement('li');
						newEle.innerHTML = "<div class=\"icons navbarmenu prefs\"></div><a href=\"#\">Switch account</a>";
						$(".playerTopMenu ul:first").append(newEle).on("click", fakeLogout());
					}

					$(".playerTopMenu").on("click", function () {
						expandOptions(users.length);
					});

					$(".tkuser").each(function (i, obj) {
						//console.log(i + " " + users[i].name + " " + users[i].session);
						//console.log(obj);
						$(obj).parent().on("click", function () {
							//console.log($(this));
							loadSession(users[i].session);
							//console.log(users[i].name + " " + users[i].session);
						});
					});
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
function fakeLogout() {
	saveCurrentUser();
	saveCurrentUser();chrome.runtime.sendMessage({
		cookie: null
	}, function (response) {
		window.href = window.location;
	});
}

// Never returns
function loadSession(newCookie) {
	//console.log(newCookie);
	chrome.runtime.sendMessage({
		cookie: newCookie
	}, function (response) {
		if (typeof response.farewell == "undefined" || response.farewell == "ERROR") {
			alert("Unable to load account");
		} else {
			window.href = window.location;
		}
	});
}

function expandOptions(userCount) {
	$(".playerTopMenu").toggleClass("active");
	if ($(".playerTopMenu").is(".active")) {
		$(".playerTopMenu .icons.carrot.grey").removeClass("down").addClass("up");
		$(".speechBubble").css("z-index", 0);
		$(".playerTopMenu").animate({
			height: (108 + 30 * (userCount )) + "px"
		}, 200)
	} else {
		$(".playerTopMenu .icons.carrot.grey").removeClass("up").addClass("down");
		$(".playerTopMenu").animate({
			height: "45px"
		}, 200, function () {
			$(".speechBubble").css("z-index", 200)
		})
	}
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
		var users = $.map(items, function (value, index) {
				return [value];
			});
		users = users[0];
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
			var users = $.map(items, function (value, index) {
					return [value];
				});
			users = users[0];
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
			var users = $.map(items, function (value, index) {
					return [value];
				});
			users = users[0];
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
