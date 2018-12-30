if (window.location.href == "https://tf2center.com/") {
	window.location.href = "https://tf2center.com/lobbies";
}

window.noAds = true;
$(".youShallNotPassEnabled").removeClass("youShallNotPassEnabled")
// Remove warnings
$('.join-steam-group').parent().parent().remove();
$('.verifySteamProfile').parent().parent().remove();
$('a[href="./faq#adblock"]').remove();
$('.contentWrapper').first().removeAttr('style'); // Remove space for warnings
// Remove existing click handlers which we will replace
$('.playerTopMenu').prop('onclick', null).off('click');
$('.trigger').prop('onclick', null).off('click');
