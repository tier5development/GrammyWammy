$(document).ready(function(){ 
    console.log("I am in messageList JS ");
    
  
    var target = document.querySelector('.N9abW');
    var LocationDetails =window.location;
    var count  = 0;
    var observer = new MutationObserver(function(mutations) {
      
      mutations.forEach(function(mutation) { 
        console.log("No  No");
        console.log(mutation.target);
        var messageLink = mutation.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("href");
        if(messageLink)
        {
          var messageId =  messageLink.split("/").pop();
          //console.log(messageId);
          var port = chrome.runtime.connect({name: "knockknock"});
          port.postMessage({options: messageId,ConFlag:"StoreMessageLinkInLocalStorage"});
          port.disconnect(); 
         }
        
      });
     });

   // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true, subtree:true }
    
    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    

});