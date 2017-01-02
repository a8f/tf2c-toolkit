if (window.location.href == "https://tf2center.com/") {
	window.location.href = "https://tf2center.com/lobbies";
}

window.noAds = true;

$('.join-steam-group').css("display", "none");
$('.youShallNotPass').css("display", "none");
$('.playerTopMenu').prop('onclick', null).off('click');
$('.trigger').prop('onclick', null).off('click');
