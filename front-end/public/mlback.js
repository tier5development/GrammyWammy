console.log("Instant Message Read");
$(document).ready(function(){
    chrome.runtime.sendMessage({type: "TrigerTheDeburger", options: "Listing"});
    
    let MainLength =$("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').length;
    //let target = $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div');
    let target = document.querySelector('.N9abW');
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var messageLink = mutation.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("href");
        if(messageLink)
        {
          var messageId =  messageLink.split("/").pop();
          console.log("this is",messageId);
          var port = chrome.runtime.connect({name: "knockknock"});
          port.postMessage({options: messageId,ConFlag:"StoreMessageLinkInLocalStorage"});
          port.disconnect(); 
         }
           

        });
    });
    // configuration of the observer:
    let config = { attributes: true, childList: true, characterData: true, subtree:true }

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    
 });

 chrome.runtime.onMessage.addListener(async function(request, sender) {
    console.log("This is the Request  From BackGround",request)
        var port = chrome.runtime.connect({name: "knockknock"});
          port.postMessage({options: request,ConFlag:"checker"});
          port.disconnect(); 
          let baseHtml = $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div').find(' > div:nth-child('+1+')').find(' > div:nth-child('+1+')');
            //console.log("this is the html",baseHtml);
            let base = $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div');
            $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div').find(' > div:nth-child('+1+')').find(' > div:nth-child('+1+')').each( async function() {
                let senderDivDtails=$(this).find('> div').each( async function(key,laa) {
                    console.log("This issss Keyyyy ========",key)
                    console.log("This issss Vall =====",laa);
                    let messagelinkId= $(laa).find('a').attr('href');
                    let anchor = $(laa).find('a');
                    if(messagelinkId){
                        let messageId =  messagelinkId.split("/").pop();
                        messageId=messageId.trim();
                        if(messageId == request.options){
                            console.log("Please hit the link---------------");
                            anchor[0].click();
                        }
                        console.log("This is the HTML Link I Got",messageId);
                        console.log("This is the HTML data I Got",request);
                    }
                    
                }) 
                
            })
           // console.log("this is the length",baselength);
 });