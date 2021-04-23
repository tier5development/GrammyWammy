const urlParam = "instaExt";
console.log("I am in Individual Message JS ");
var port = chrome.runtime.connect({name: "knockknock"});
port.onDisconnect.addListener(obj => {
  console.log('disconnected port');
  var port = chrome.runtime.connect({name: "knockknock"});
})
const sendMessageBtn = `button[class="sqdOP  L3NKy   y3zKF     "]`;

$(document).ready(function () {
  console.log("doc is ready for individual message")
  console.log($('.-qQT3.rOtsg').length);
  console.log('Testing Inside');
    var isFromExtension = getParam(urlParam);
    console.log("isfromexension",isFromExtension[0])
    if (isFromExtension[1] === "true") {
      setTimeout(function () {
        postTweet((closeWindow = true), isFromExtension[0], isFromExtension[2]);
      }, 1000);
     }
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
  console.log('Total Inbox Elements '+allMessageDiv.length);

  console.log(anchor.length);
  for (var i = 0; i < anchor.length; i++) {
      var anchorTagLink = anchor[i].href;
     
       tagId = anchorTagLink.split("/").pop();
       console.log('tagId Value '+tagId);
       if(id == tagId)
       {
          anchor[i].click();
          console.log('Condition Satisfied');
          if(message == 'Read Message')
          {
              readLastMessage(id);
          }
          else
          {
            populateTextArea(message,id);
          }
        
      }
  }
}, 1000);
};

function readLastMessage(id)
{
  console.log('Get Into The Read');
  setTimeout(() => {
    let totalIncomingMessages = (document.getElementsByClassName('Igw0E  Xf6Yq          hLiUi    ybXk5').length)-1;
    console.log(totalIncomingMessages);
    let userLastSentMessage = document.getElementsByClassName('Igw0E  Xf6Yq   hLiUi    ybXk5')[totalIncomingMessages].parentElement.parentElement.getElementsByClassName('_7UhW9   xLCgt  MMzan  KV-D4   p1tLr  hjZTB')[0].innerText;
    console.log(userLastSentMessage);
    userNameToBeSent = document.getElementsByClassName('_7UhW9    vy6Bb      qyrsm KV-D4              fDxYl     ')[1].innerText;
    console.log(userNameToBeSent);

    let params ={
      messageId : id,
      userName  : userNameToBeSent,
      messageContent:userLastSentMessage
    }
    
    port.postMessage({options: params,ConFlag:"CheckMessageContent"});
   }, 1000);
  
  
}

function populateTextArea(response,id)
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
                let params ={
                  messageId : id
                }
                port.postMessage({options: params,ConFlag:"loadHomePage"});
            }, 1000)
            /// Back To Instagram Home Page ///
           
            
        },
        function(error) {
            console.error("Unable to paste the data. Error:" +error);
            let params ={
              messageId : id
            }
            port.postMessage({options: params,ConFlag:"RefreshInbox"});
            console.log(error);
        }
    );
   }, 1000);
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