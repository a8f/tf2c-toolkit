/* 
 * Script to be injected into page context
 * Must be in a subdirectory and be added as web_accessible_resource in manifest.json
 */

// Cloudflare landing page has no jquery so avoid any errors
if (window.jQuery) {
    // Skip landing page automatically
    if (window.location.href == "https://tf2center.com/") {
        window.location.href = "https://tf2center.com/lobbies";
    }
    // Hide ads using site's built in ad disabling (lol)
    window.noAds = true;
    $(".youShallNotPassEnabled").removeClass("youShallNotPassEnabled")
    // Remove warnings
    $('.join-steam-group').parent().parent().remove();
    $('.verifySteamProfile').parent().parent().remove();
    $('a[href="./faq#adblock"]').remove();
    $('.contentWrapper').first().removeAttr('style'); // Remove space where warnings were
    // Remove existing click handlers which we will replace
    $('.playerTopMenu').prop('onclick', null).off('click');
    $('.trigger').prop('onclick', null).off('click');
}
