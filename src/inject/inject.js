if (window.location.href == "https://tf2center.com/") {
	window.location.href = "https://tf2center.com/lobbies";
}

window.noAds = true;

$('.playerTopMenu').prop('onclick', null).off('click');
$('.trigger').prop('onclick', null).off('click');
