const urlParam = "instaExt";
var port = chrome.runtime.connect({name: "knockknock"});
port.onDisconnect.addListener(obj => {
  console.log('disconnected port');
  var port = chrome.runtime.connect({name: "knockknock"});
})
const sendMessageBtn = `button[class="sqdOP  L3NKy   y3zKF     "]`;

$(document).ready(function () {
  console.log("doc is ready")
$("body").arrive(sendMessageBtn, function () {
    var isFromExtension = getParam(urlParam);
    console.log("isfromexension",isFromExtension[0])
    if (isFromExtension[1] === "true") {
      setTimeout(function () {
        postTweet((closeWindow = true), isFromExtension[0], isFromExtension[2]);
      }, 1000);
     }
 
  })
});
const getParam = (paramName) => {
  var urlString = window.location.href;
  console.log(urlString);
  var url = new URL(urlString);
  var id = url.searchParams.get("id");
  var message = url.searchParams.get("message");
  var c = url.searchParams.get(paramName);
  return [id, c, message];
};

const goTo = (page, title, url) => {
  if ("undefined" !== typeof history.pushState) {
    history.pushState({ page: page }, title, url);
  } else {
    window.location.assign(url);
  }
};

const postTweet = (closeWindow,id,message) => {
  console.log('Value id '+id);
  console.log('Response Message '+message);
  setTimeout(() => {
  var anchor = document.getElementsByClassName("-qQT3 rOtsg");
  let allMessageDiv = document.getElementsByClassName(' DPiy6 Igw0E IwRSH eGOV_ _4EzTm ');
  console.log(allMessageDiv.length);
  console.log(anchor.length);
  for (var i = 0; i < anchor.length; i++) {
      var anchorTagLink = anchor[i].href;
     
       tagId = anchorTagLink.split("/").pop();
       console.log('tagId Value '+tagId);
       if(id == tagId)
       {
          console.log('Condition Satisfied');
          populateTextArea(message);
          anchor[i].click();
         
       }
  }
}, 1000);
 

};

function populateTextArea(response)
{
  setTimeout(function() {
    var message = response;
    console.log(message);
    $(`textarea`).focus();
    const blob = new Blob([message], { type: 'text/plain' });
    let cpData = [new ClipboardItem({ 'text/plain': blob })];

    navigator.clipboard.write(cpData).then(
        function() {
            $(`textarea`).focus();
            console.log('came here');
            document.execCommand("paste");
            
            setTimeout(function() {
             console.log('Trigger Button Here');
             $('button:contains("Send")').trigger('click');            
            }, 1000)
            /// Back To Instagram Home Page ///
            setTimeout(function() {
                 port.postMessage({options: '',ConFlag:"loadHomePage"});
            }, 1000)
            /// Back To Instagram Home Page ///
           
            
        },
        function(error) {
            console.error("Unable to paste the data. Error:" +error);
            console.log(error);
        }
    );
   }, 1000);
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  console.log(request.catch);
  if(request.catch === "get-login-info")
  {
    console.log('I am getting this', request);
    let WindowId    =   request.data.windowinfo;
    let TabId   =   request.data.tabinfo;
    let WindowIdString  =   String(WindowId);
    let TabIdString =   String(TabId);
   
    let UserKyubiToken = request.data.userToken; 
    
   
    let InstagramUsername  = "";
    let UserInstagramName  = "";
    let UserInstagramImage = "";
    let UserLoggedInInstagram  = false;

    
    if($('.ctQZg').length)
    {
      console.log("User Logged In");
      InstagramUsername  = $('.gmFkV').attr('href').replace(/\//g,'');
      UserInstagramName  = document.getElementsByClassName('_7UhW9   xLCgt      MMzan   _0PwGv             fDxYl ')[1].innerHTML;
      UserInstagramImage  =  document.getElementsByClassName('_47KiJ')[0].children[4].children[1].children[0].src;
      UserLoggedInInstagram  = true;
    }
    else
    {
      console.log("User Not Logged In");
      InstagramUsername  = "";
      UserInstagramName  = "";
      UserInstagramImage  =  "";
      UserLoggedInInstagram  = false;
      UserKyubiToken=atob(tokens[1]);
    }
    let parameters={
      token : UserKyubiToken,
      insta_username : InstagramUsername,
      insta_name : UserInstagramName,
      insta_image  : UserInstagramImage,
      insta_logged_id  : UserLoggedInInstagram,
      tabinfo : TabId,
      windowinfo  : WindowId
    }
    console.log(parameters);
    chrome.runtime.sendMessage({type: "storeUserInfoOrQueryThenStore", options: parameters});
  }
  if(request.catch === "check-new-incoming-message")
  {
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
      //  reloadParams ='';
      //  port.postMessage({options: reloadParams,ConFlag:"reloadMessage"});
        setTimeout(() => {
        let allMessageDiv = document.getElementsByClassName(' DPiy6 Igw0E IwRSH eGOV_ _4EzTm ');
       
        let unreadMessage = 0;
        for (var i = 0; i < allMessageDiv.length; i++) {
            if(allMessageDiv[i])
            { 
              let childDiv = allMessageDiv[i].children[0].children[0]; 
              
              if(childDiv.childElementCount == 3)
              {   
                  
                  let messageUsername = childDiv.children[1].children[0].children[0].children[0].children[0].children[0].textContent;
                  let latestMsgDiv = childDiv.children[1].children[1];
                  let messageLink = 'https://www.instagram.com'+allMessageDiv[i].children[0].getAttribute("href");
                  let latestMsgDivContent = latestMsgDiv.children[0].children[0].children[0].children[0].textContent;
                  if(latestMsgDivContent == 'Typing...')
                  {
                    fetchMessageDetails();
                    return false;
                  }
                  else
                  {
                    postMessage(messageLink , messageUsername , latestMsgDivContent);
                  }
             
                  
               }
              
            }
        }
      }, 1000);
    }

    }
});

function postMessage(link,user,message)
{
  console.log('Post Function called');
  setTimeout(() => {
  let params ={
    messageLink : link,
    userName  : user,
    messageContent:message
  }
  
  //chrome.runtime.sendMessage({type: "postIndividualMessage", options: params});
  port.postMessage({options: params,ConFlag:"CheckMessageContent"});

 
}, 2000);
}

port.onMessage.addListener(async function(msg) {
  if (msg.ConFlagBack == "DEFAULTMESSAGEBACK"){
   
    //console.log("RESPONSE To USER With Default Message",msg.userInfoDetails);
        let Nowtime=$.now();
        
        let setDefaultMessageSaveONEX={
          FacebookFirstName: msg.ThreadParams.FacebookFirstName,
          FacebookLastName: msg.ThreadParams.FacebookLastName,
          FacebookUserId: msg.ThreadParams.FacebookUserId,
          FriendFacebookId: msg.ThreadParams.FriendFacebookId,
          MfenevanId: msg.ThreadParams.MfenevanId,
          ProfileLink: msg.ThreadParams.ProfileLink,
          ResponseMessage: msg.userInfoDetails,
          ResponseTime:Nowtime,
          MessageSenderType:"last_default_message_time",
          LocationDetails:''
          };
        //console.log("RESPONSE To Save  and Close With Link",setDefaultMessageSaveONEX);
        port.postMessage({MessageDetails: setDefaultMessageSaveONEX,ConFlag:"STOREANDCLOSE"});
  }
})
