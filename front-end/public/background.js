//console.log("I am background ");
//console.log("I am background 1234",screen.width);
//console.log("I am background 1234",screen.height);
const getApiUrl = "http://localhost:8080/"; //"https://api.mefnevan.com" ;
const MessageListUrl = `https://mbasic.facebook.com/messages`;
const mBasicUrl = 'https://mbasic.facebook.com';
const mFacebook = 'https://m.facebook.com';
const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);
const getUserToken = () => localStorage.getItem("kyubi_user_token");
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
      let UserToken=getUserToken();
      
      if(WindowURL === 'https://www.instagram.com/direct/inbox/')
      {
          localStorage.setItem('messageListId',TabId);
          data={tabinfo:TabId,windowinfo:WindowId}
          chrome.tabs.sendMessage(TabId, { catch: "check-new-incoming-message",data });
          // scanForNewMessage();
          
         
      }
      if(WindowURL === 'https://www.instagram.com/'){
          localStorage.setItem('profileTabId',TabId);
          console.log("Yes the Profile is there Suvadeep");
          console.log("This is info from background",tab);
          data={userToken:UserToken,tabinfo:TabId,windowinfo:WindowId}
          console.log(data);
          reloadInstagram();
          chrome.tabs.sendMessage(TabId, { catch: "get-login-info",data });
          
      }
     
     
  }
});

function scanForNewMessage(){
  console.log('called');
  setInterval(function(){ 

    chrome.windows.getCurrent(w => {
      chrome.tabs.query({active: true, windowId: w.id}, tabs => {
        const tabId = tabs[0].id;
        data={}
        chrome.tabs.sendMessage(tabId, { catch: "check-new-incoming-message",data });
        
      });
    });
    }, 6000);
 
}

function reloadInstagram()
{
//   chrome.tabs.query({url: "*://*.instagram.com/direct/inbox/"}, function(tab) {
//   chrome.tabs.reload(tab[0].id) 
//  });
// chrome.tabs.update( parseInt(localStorage.getItem("messageListId")), { 
//   url: `https://www.instagram.com/direct/inbox/`,
//   active: true});
//  setTimeout(reloadInstagram, 300000);
}

/** 
 * this will listen to the  on runtime Message
 * 
*/

chrome.runtime.onMessage.addListener(async function(request, sender) {
 
  if (request.type == "storeUserInfoOrQueryThenStore"){
        console.log("This I Got In Background",request.options);
        let  params ={
        user_rec    :   localStorage.getItem('kyubi_user_token'),
        fb_id   :   request.options.FacebookId,
        fb_username :   request.options.insta_username,
        fb_name :   request.options.insta_name,
        fb_image    :  request.options.insta_image,
        fb_logged_id    :   request.options.insta_logged_id
        };
        await handleRequest(
            "api/user/userCheckStoreNRetrive",
            method.POST,
            toJsonStr(params)
            ).then(async response =>  {
              let responsenewvalue = await response.json();
                      let  urlArray="[]";
                      console.log("This from DB",responsenewvalue);
                      localStorage.setItem('CheckMessageNReply', 0);
                      localStorage.setItem('ListURLArray', urlArray);
                      localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                      localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                      localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_fbid);
                      localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_profile_name);
                      localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_name);
                      localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
                      localStorage.setItem('fb_logged_id', request.options.insta_logged_id);
                      localStorage.setItem('inBackgroundFetching', false);
                      localStorage.setItem('profileFetch',0);
                      localStorage.setItem('messageListFetch',0);
                      localStorage.setItem('individualMessageFetch',0);
                      UserLoggedInFacebook=request.options.insta_logged_id;
                      BackGroundFetchingStatus  =false;
                      if(responsenewvalue.payload.UserSettings.default_message){
                        localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
                        DefaultMessageStatus=responsenewvalue.payload.UserSettings.default_message;
                      }else{
                        localStorage.setItem('default_message', 0);
                      }
                      if(responsenewvalue.payload.UserSettings.default_message_text){
                        localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
                      }else{
                        localStorage.setItem('default_message_text',"");
                      }
                      if(responsenewvalue.payload.UserSettings.autoresponder){
                        localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
                        AutoResponderStatus=responsenewvalue.payload.UserSettings.autoresponder;
                      }else{
                        localStorage.setItem('autoresponder', 0);
                      }
                      if(responsenewvalue.payload.UserSettings.default_time_delay){
                        localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
                      }
                      localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));
                      if((AutoResponderStatus == 1 || DefaultMessageStatus == 1) && UserLoggedInFacebook== true && BackGroundFetchingStatus==  false ){
                        console.log("Open Message List  84848484");
                      
                        const myNewUrl  =   `https://www.instagram.com/direct/inbox/`;
                        let CreateTab    =   chrome.tabs.create({
                            url: myNewUrl,
                            active: true
                          });
                      } 
            }).catch(error=>{
              localStorage.setItem('profileFetch',0);
              localStorage.setItem('messageListFetch',0);
              localStorage.setItem('individualMessageFetch',0);
              
            } )

    }
    if (request.type == "OpenMessageProfileToRead"){
      //console.log("User Details",request.options);
      localStorage.setItem('profileFetch',1);
      //document.getElementById('profileFrame').src = request.options;
      let ListURLArray =[];
      let NewListURLArray=JSON.stringify(ListURLArray);
      localStorage.setItem('ListURLArray', NewListURLArray);
      localStorage.setItem('CheckMessageNReply',0);
    }
    if(request.type == "CloseAllForResponse"){
      localStorage.setItem('profileFetch',0);
      let ListURLArray =[];
      let NewListURLArray=JSON.stringify(ListURLArray);
      localStorage.setItem('ListURLArray', NewListURLArray);
      localStorage.setItem('CheckMessageNReply',0);
      //document.getElementById('profileFrame').src = "";
      // document.getElementById('messageListMain').src = "";
      // document.getElementById('messageIndividualMain').src = "";
    }
    if(request.type ==  "OpenSeconderyUrlToReadMessageList"){
      //document.getElementById('messageListSecondery').src = mFacebook+""+request.options;
    }
    if(request.type ==  "StoreMessageLinkInLocalStorage"){
      let ListURL=localStorage.getItem('ListURLArray');
      let ListURLArray=JSON.parse(ListURL);
      if(ListURLArray.length  === 0){
        ListURLArray[ListURLArray.length]=mBasicUrl+""+request.options;
        let NewListURLArray=JSON.stringify(ListURLArray);
        localStorage.setItem('ListURLArray', NewListURLArray);
      }else{
        let check = ListURLArray.includes(mBasicUrl+""+request.options);
        if(check){

        }else{
        ListURLArray[ListURLArray.length]=mBasicUrl+""+request.options;
        let NewListURLArray=JSON.stringify(ListURLArray);
        localStorage.setItem('ListURLArray', NewListURLArray);
        }
        
      }
      CheckLocalStoreAndHitIndividualMList();
      
    }

})

const urlParam = "instaExt";
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {

      if (msg.ConFlag == "CheckMessageContent")
      {
              messageLink = msg.options.messageLink;
              messageId = messageLink.split("/").pop();
              messageUserName = msg.options.userName;
              if(msg.options.messageContent == 'Typing...')
              {
                return false;
              }
              setUserDetails(messageUserName);
              messageContent =  getAutoResponseText(msg.options.messageContent,messageUserName);
              
              chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${messageContent}&${urlParam}=true`,
                active: true}, function(tab) {
                  tabId = tab.id;
                });
      
      }
        function getAutoResponseText(message,userName)
        {
           
            let autoResponderKeywords = JSON.parse(localStorage.getItem('keywordsTally'));
            let responseMessage ='';
            for (var i = 0; i < autoResponderKeywords.length; i++) {
              let object = autoResponderKeywords[i];
                  
                  if (message.includes(object.keyword)) {
               
                      console.log('Details '+localStorage.getItem("individualMessageDetails"));
                      console.log('Username'+userName);
                      if(localStorage.getItem("individualMessageDetails"))
                      {
                          console.log('stored');
                          fullName = JSON.parse(localStorage.getItem("individualMessageDetails")).userFullName;
                      }
                      else
                      {
                          console.log('no stored');
                          fullName = userName;
                      }
                      console.log(fullName+' Full Name');
                      let splitFullName = fullName.split(" ");
                      let firstName = (splitFullName[0]) ? splitFullName[0] :'';
                      let lastName = (splitFullName[1]) ? (splitFullName[1]) : '';
    
    
                      let ResponseText = object.message;
                      console.log(ResponseText);
                      console.log(firstName);
                      console.log(lastName);
                      let NowTime=new Date().getTime();  
                      let a = new Date(NowTime);
                      let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                      let year = a.getFullYear();
                      let month = months[a.getMonth()];
                      let date = a.getDate();
                     
                      let OnlyDate = date + ' ' + month + ' ' + year ;
                      let NewResponseText = ResponseText.replace('{first_name}',firstName);
                      NewResponseText = NewResponseText.replace('{last_name}',lastName);
                      NewResponseText = NewResponseText.replace('{Date}',OnlyDate);
                      NewResponseText = NewResponseText.replace('{date}',OnlyDate);
                      responseMessage += NewResponseText;
                  } 
            }
            if(responseMessage)
            {
               return responseMessage;
            }
            else
            {
              return localStorage.getItem('default_message_text');
            }
        }
    
        function setUserDetails(userName)
        {
          
            var regex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/);
            var validation = regex.test(userName);
            if(validation) {
              $.get("https://www.instagram.com/"+userName+"/?__a=1")
              .done(function(data) { 
    
                var userImage = data["graphql"]["user"]["profile_pic_url_hd"];
                var userFullName = data["graphql"]["user"]["full_name"];
                var userId = data["graphql"]["user"]["id"];
                var userName = data["graphql"]["user"]["username"];
                let  params ={
                  userId    :   userId,
                  userFullName   :   userFullName,
                  userName :   userName,
                  userImage :   userImage
                };
                localStorage.setItem("individualMessageDetails",JSON.stringify(params));
    
                })
              .fail(function() { 
                // code for 404 error 
                console.log('Username was not found!')
              })
            
            } else {
              console.log('The username is invalid!')
            }
        }
    
        if(msg.ConFlag   ==  "loadHomePage")
        {
         
          chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
            url: `https://www.instagram.com/${localStorage.getItem("fb_username")}`,
            active: false});

            chrome.tabs.update( parseInt(localStorage.getItem("messageListId")), { 
              url: `https://www.instagram.com/direct/inbox/`,
              active: true});
        }
        if(msg.ConFlag   ==  "reloadMessage")
        {
          
          // chrome.tabs.update( parseInt(localStorage.getItem("messageListId")), { 
          //   url: `https://www.instagram.com/direct/inbox/`,
          //   active: true});
        }
  });
});


