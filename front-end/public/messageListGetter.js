// $(document).ready(function(){ 
//   console.log("Yo 1 Yo");
//   var target = document.querySelector('.N9abW');
//   var LocationDetails =window.location;
//   var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       console.log("No  No");
//         console.log(mutation.target)
//         //         let port = chrome.runtime.connect({name: "ListKnock"});
//         //         port.postMessage({options: senderUrl,ConFlag:"StoreMessageLinkInLocalStorage"});
//         //         port.disconnect();
//         // $(mutation.target).find('.unreadMessage').each( async function() {
//         //     //console.log("Yo  Yo");
//         //     let senderDivDtails=$(this).html(); 
//         //     //console.log("This issss",senderDivDtails)
//         //     let senderUrl=$(this).find('a').attr("href"); 
//         //     //console.log(senderUrl);
//         //     if(senderUrl.includes("%3A")){
//         //         let port = chrome.runtime.connect({name: "ListKnock"});
//         //         port.postMessage({options: senderUrl,ConFlag:"StoreMessageLinkInLocalStorage"});
//         //         port.disconnect(); 
//         //     }
//         //     //chrome.runtime.sendMessage({type: "StoreMessageLinkInLocalStorage", options: senderUrl});
            
//         // });
        
//     });
// });

// // configuration of the observer:
// var config = { attributes: true, childList: true, characterData: true }

// // pass in the target node, as well as the observer options
// observer.observe(target, config);
// });
$(document).ready(function(){ 
  setTimeout(async function(){

    if (document.querySelector('.mydivclass') !== null) {
      // .. it exists
    var port = chrome.runtime.connect({name: "knockknock"});
    port.postMessage({options: "xxx",ConFlag:"HitCheck"});
    port.disconnect();
    }else{
      console.log("No  NoStockkkkkkk");
    }
  },6000);

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

// function funct(){
//   setTimeout(async function(){  
//     if (document.querySelector('.mydivclass') !== null) {
//       // .. it exists
//     var port = chrome.runtime.connect({name: "knockknock"});
//     port.postMessage({options: "xxx1111",ConFlag:"HitCheck"});
//     port.disconnect();
//     }else{
//       funct();
//     }
//   },3000);
// }
