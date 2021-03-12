
$(document).ready(function(){ 
var target = document.querySelector('#threadlist_rows');
var LocationDetails =window.location;

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        
        //console.log(mutation.target)
        
        $(mutation.target).find('.unreadMessage').each( async function() {
            //console.log("Yo  Yo");
            let senderUrl=$(this).find('a').attr("href"); 
            //console.log(senderUrl);
            chrome.runtime.sendMessage({type: "StoreMessageLinkInLocalStorage", options: senderUrl});

        });
        
    });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }

// pass in the target node, as well as the observer options
observer.observe(target, config);

});