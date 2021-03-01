const urlParam = "instaExt";
const sendMessageBtn = `button[class="sqdOP  L3NKy   y3zKF     "]`;

$(document).ready(function () {
  console.log("doc is ready")
$("body").arrive(sendMessageBtn, function () {
    var isFromExtension = getParam(urlParam);
    console.log("isfromexension",isFromExtension[0])
    if (isFromExtension[1] === "true") {
      setTimeout(function () {
        postTweet((closeWindow = true), isFromExtension[0]);
      }, 1000);
     }
 
  })
});
const getParam = (paramName) => {
  var urlString = window.location.href;
  console.log(urlString);
  var url = new URL(urlString);
  var id = url.searchParams.get("id");
  var c = url.searchParams.get(paramName);
  return [id, c];
};

const goTo = (page, title, url) => {
  if ("undefined" !== typeof history.pushState) {
    history.pushState({ page: page }, title, url);
  } else {
    window.location.assign(url);
  }
};

const postTweet = (closeWindow,id) => {
  console.log('Value id '+id);
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
          populateTextArea();
          anchor[i].click();
         
       }
  }
}, 5000);
 

};

function populateTextArea()
{
  setTimeout(function() {
    var message = "Hey, How are you doing ?";
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
           
            
        },
        function(error) {
            console.error("Unable to paste the data. Error:" +error);
            console.log(error);
        }
    );
   }, 2000);
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  console.log(request.catch);
  setTimeout(() => {
  let allMessageDiv = document.getElementsByClassName(' DPiy6 Igw0E IwRSH eGOV_ _4EzTm ');
  console.log(allMessageDiv);
  console.log(allMessageDiv.length);

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
            console.log(messageUsername);
            console.log(messageLink);
            console.log(latestMsgDivContent);
            postMessage(messageLink , messageUsername);
        }
      }
   }
}, 1000);
});
function postMessage(link,user)
{
  let params ={
    messageLink : link,
    userName  : user
  }
 
  chrome.runtime.sendMessage({type: "postIndividualMessage", options: params});

}