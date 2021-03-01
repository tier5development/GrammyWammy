const getUserToken = () => localStorage.getItem("token");
console.log("I am background");

const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);

const getApiUrl = 'http://localhost:8080';
const mBasicUrl = 'https://mbasic.facebook.com';
/** 
 * @handleRequest
 * this function will handel the https request
 * 
*/
const handleRequest = (path, methodType, bodyData) => {
    let getWithCredentialHeader = {
        'Accept': 'application/json', 'Content-Type': 'application/json','Access-Control-Allow-Origin': true
    };
    return fetch(getApiUrl + path, {
      method: methodType,
      headers: getWithCredentialHeader,
      body: bodyData,
    });
  };
/** 
 * this will listen to the  URL and Take decission depending on the URL and tallying  windowID in localstore
 * 
*/
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    /**
     * Once the window is loaded
     */
    if (changeInfo.status === 'complete') {
        let WindowURL   =   tab.url
        let WindowId    =   tab.windowId;
        let TabId   =   tab.id;
       
        if(WindowURL === 'https://www.instagram.com/direct/inbox/')
        {
            console.log('Satisfied');
            data={tabinfo:TabId,windowinfo:WindowId}
            chrome.tabs.sendMessage(TabId, { catch: "check-new-incoming-message",data });
           
        }
       
       
    }
});

/** 
 * this will listen to the  on runtime Message
 * 
*/
const urlParam = "instaExt";
chrome.runtime.onMessage.addListener(async function(request, sender) {
    if(request.type   ==  "postIndividualMessage"){
        messageLink = request.options.messageLink;
        messageId = messageLink.split("/").pop();
        messageUserName = request.options.userName;
        console.log('Id '+messageId);
        console.log('On BackGround '+messageUserName);
        console.log(`https://www.instagram.com/direct/inbox/?id=${messageId}&${urlParam}=true`);
        chrome.windows.create({
            url:`https://www.instagram.com/direct/inbox/?id=${messageId}&${urlParam}=true`,
            type: "popup",
            focused: true,
            height: 100,
            width: 100,
            left: 10000,
            });
        }
});


