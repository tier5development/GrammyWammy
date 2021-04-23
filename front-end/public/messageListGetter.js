
$(document).ready(function(){ 
    console.log("I am in messageList JS ");
    
  
    var target = document.querySelector('.N9abW');
    var LocationDetails =window.location;
    var count  = 0;
    var observer = new MutationObserver(function(mutations) {
      
      mutations.forEach(function(mutation) { 
        if(mutation.addedNodes.length === 1)
        {
            
            $(mutation.addedNodes).each( async function() {
                var messageTextLength = $(this).text().length;
                //console.log($(this));
                //console.log(messageTextLength);
                
              
                if(messageTextLength === 0)
                {
                  console.log('Satisfied'); 
                  var port = chrome.runtime.connect({name: "knockknock"});
                  port.postMessage({options: 'test',ConFlag:"mutation"});
                  port.disconnect(); 
                }
            });
        }
      });
     });

   // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true, subtree:true }
    
    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    

});