
$(document).ready(function(){ 
    console.log("I am in messageList JS ");
    
  
    var target = document.querySelector('.N9abW');
    var LocationDetails =window.location;
    var count  = 0;
    var observer = new MutationObserver(function(mutations) {
      
      mutations.forEach(function(mutation) { 
        var messageLink = mutation.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("href");
        if(messageLink)
        {
          var messageId =  messageLink.split("/").pop();
          //console.log(messageId);
          var port = chrome.runtime.connect({name: "knockknock"});
          port.postMessage({options: messageId,ConFlag:"StoreMessageLinkInLocalStorage"});
          port.disconnect(); 
         }
        if(mutation.addedNodes.length === 1)
        {
            
            // $(mutation.addedNodes).each( async function() {
            //     var messageTextLength = $(this).text().length;
               
            //     if(messageTextLength === 0)
            //     {
            //       console.log('Satisfied');
            //       var messageLink = mutation.target.parentElement.getAttribute("href");
            //       console.log(messageLink);
            //       if(messageLink)
            //       {
            //         var messageId =  messageLink.split("/").pop();
            //         var port = chrome.runtime.connect({name: "knockknock"});
            //         //port.postMessage({options: 'test',ConFlag:"mutation"});
            //         port.postMessage({options: messageId,ConFlag:"StoreMessageLinkInLocalStorage"});
            //         port.disconnect(); 
            //       }
                 
            //     }
            // });
        }
      });
     });

   // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true, subtree:true }
    
    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    

});