
$(document).ready(function(){ 
    console.log("I am in messageList JS ");
    var port = chrome.runtime.connect({name: "knockknock"});
    port.onDisconnect.addListener(obj => {
      console.log('disconnected port');
      var port = chrome.runtime.connect({name: "knockknock"});
    }) 


    fetchMessageDetails();
    var target = document.querySelector('.N9abW');
    var LocationDetails =window.location;
    var count  = 0;
    var observer = new MutationObserver(function(mutations) {
      
      mutations.forEach(function(mutation) { 
        if(mutation.addedNodes.length === 1)
        {
            
            $(mutation.addedNodes).each( async function() {
                var messageTextLength = $(this).text().length;
                // console.log(messageTextLength);
                if(messageTextLength === 0)
                {
                console.log('Satisfied'); 
                fetchMessageDetails();
                }
            });
        }
      });
     });

   // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true, subtree:true }
    
    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    function fetchMessageDetails()
    {
       console.log('Function Called');
       setTimeout(() => {
        let allMessageDiv = document.getElementsByClassName(' DPiy6 Igw0E IwRSH eGOV_ _4EzTm ');
        console.log('Total Inbox Elements '+allMessageDiv.length);
        let unreadMessage = 0;
        for (var i = 0; i < allMessageDiv.length; i++) {
            if(allMessageDiv[i])
            { 
              let childDiv = allMessageDiv[i].children[0].children[0]; 
              
              if(childDiv.childElementCount == 3)
              {   
                  
                  let messageLink = 'https://www.instagram.com'+allMessageDiv[i].children[0].getAttribute("href");
                  let messageId =  messageLink.split("/").pop();
                  console.log(messageId);
                  port.postMessage({options: messageId,ConFlag:"StoreMessageLinkInLocalStorage"});
                  
              }
              
            }
        }
      }, 1000);
    }

});