const getUserToken = () => localStorage.getItem("token");
console.log("I am background");

const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);

const getApiUrl = 'http://localhost:8080/';
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
        let WindowIdString  =   String(tab.windowId);
        let TabIdString =   String(tab.id);
        let CheckProfileIDPresent   =   false;
        let CheckMListIDPresent   =   false;
        let CheckMThreadIDPresent   =   false;
        let UserToken=getUserToken();
        let FaceBookUsername    =   localStorage.getItem('fb_username');
        let IsFaceBookLoggedIn  =   localStorage.getItem('fb_logged_id');

        let fbprofile=localStorage.getItem('fbprofile');
        if(fbprofile){
            let resfbprofile = fbprofile.split(",");
            CheckProfileIDPresent   =  resfbprofile.includes(WindowIdString);
        }
       
        if(WindowURL === 'https://www.instagram.com/direct/inbox/')
        {
            console.log('Satisfied');
            data={tabinfo:TabId,windowinfo:WindowId}
            chrome.tabs.sendMessage(TabId, { catch: "check-new-incoming-message",data });
           
        }
        if(WindowURL === 'https://www.instagram.com/' && CheckProfileIDPresent==true){
            console.log("Yes the Profile is there Suvadeep");
            console.log("This is info from background",tab);
            data={userToken:UserToken,tabinfo:TabId,windowinfo:WindowId}
            console.log(data);
            chrome.tabs.sendMessage(TabId, { catch: "get-login-info",data });
        }
       
       
    }
});

/** 
 * this will listen to the  on runtime Message
 * 
*/
const urlParam = "instaExt";
chrome.runtime.onMessage.addListener(async function(request, sender) {

    let WindowId    =   request.options.windowinfo;
    let TabId   =   request.options.tabinfo;
    if (request.type == "storeUserInfoOrQueryThenStore")
    {
        let UserKyubiToken  =   request.options.token;
        let InstagramUsername    =   request.options.insta_username;
        let UserInstagramName    = request.options.insta_name;
        let UserInstagramImage   =   request.options.insta_image;
        let UserLoggedInInstagram    =   request.options.insta_logged_id;
        let DefaultMessageStatus    =   0;   
        let DefaultMessageText    =   "";
        let AutoResponderStatus    =   0;
        let DefaultMessageDelayTime    =   0;
        let AutoResponderKeywords    =   JSON.stringify([]);
        let BackGroundFetchingStatus    =   true;
        let GrammywammyUserId  =   "";
        if(request.options.insta_logged_id===true)
        {
            console.log("This to store or Query then store 1 ",request.options);
            let  params ={
                user_rec    :   UserKyubiToken,
                insta_username :   InstagramUsername,
                insta_name :   UserInstagramName,
                insta_image    :   UserInstagramImage,
                insta_logged_id    :   BackGroundFetchingStatus
            }
            await handleRequest(
                "api/user/userInstagram",
                method.POST,
                toJsonStr(params)
                ).then(async response =>  {
                    let responsenewvalue = await response.json();
                    console.log(responsenewvalue);
                    UserInstagramUsername    =   responsenewvalue.payload.UserInfo.instagram_profile_name;
                    UserInstagramName    = responsenewvalue.payload.UserInfo.instagram_name;
                    UserInstagramImage   =   responsenewvalue.payload.UserInfo.instagram_image;
                    // DefaultMessageStatus    =   responsenewvalue.payload.UserSettings.default_message;   
                    // DefaultMessageText    =   responsenewvalue.payload.UserSettings.default_message_text;
                    // AutoResponderStatus    =   responsenewvalue.payload.UserSettings.autoresponder;
                    // DefaultMessageDelayTime    =   responsenewvalue.payload.UserSettings.default_time_delay;
                    // AutoResponderKeywords    =   JSON.stringify(responsenewvalue.payload.AutoResponderKeywords);
                    BackGroundFetchingStatus    =   false;
                    GrammyWammyUserId  =   responsenewvalue.payload.UserInfo.user_id;
                });
        }
        else
        {
            console.log("This to store or Query then store 2 ",request.options);
            let  params ={
                user_rec    :   UserKyubiToken,
            }
            await handleRequest(
                "api/user/getUserDetails",
                method.POST,
                toJsonStr(params)
                ).then(async response =>  {
                    let responsenewvalue = await response.json();
                    console.log(responsenewvalue);
                    UserInstagramUsername    =   responsenewvalue.payload.UserInfo.instagram_profile_name;
                    UserInstagramName    = responsenewvalue.payload.UserInfo.instagram_name;
                    UserInstagramImage   =   responsenewvalue.payload.UserInfo.instagram_image;
                    // UserFacebookid  =   responsenewvalue.payload.UserInfo.facebook_fbid;
                    // UserFacebookUsername    =   responsenewvalue.payload.UserInfo.facebook_name;
                    // UserFacebookName    = responsenewvalue.payload.UserInfo.facebook_profile_name;
                    // UserFacebookImage   =   responsenewvalue.payload.UserInfo.facebook_image;
                    // DefaultMessageStatus    =   responsenewvalue.payload.UserSettings.default_message;   
                    // DefaultMessageText    =   responsenewvalue.payload.UserSettings.default_message_text;
                    // AutoResponderStatus    =   responsenewvalue.payload.UserSettings.autoresponder;
                    // DefaultMessageDelayTime    =   responsenewvalue.payload.UserSettings.default_time_delay;
                    // AutoResponderKeywords    =   JSON.stringify(responsenewvalue.payload.AutoResponderKeywords);
                    // BackGroundFetchingStatus    =   false;
                    // MfenevanUserId  =   responsenewvalue.payload.UserInfo.user_id;
                    BackGroundFetchingStatus    =   false;
                    GrammyWammyUserId  =   responsenewvalue.payload.UserInfo.user_id;
                });
        }
        localStorage.setItem('kyubi_user_token', UserKyubiToken);
        localStorage.setItem('user_id', GrammyWammyUserId);
        localStorage.setItem('insta_username', UserInstagramUsername);
        localStorage.setItem('insta_name', UserInstagramName);
        localStorage.setItem('insta_image', UserInstagramImage);
        localStorage.setItem('insta_logged_id', UserLoggedInInstagram);
        localStorage.removeItem("fbprofile");
        chrome.tabs.remove(TabId);
        chrome.windows.remove(WindowId);
    }

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


