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
          
          data={tabinfo:TabId,windowinfo:WindowId}
          chrome.tabs.sendMessage(TabId, { catch: "check-new-incoming-message",data });
          scanForNewMessage();
          reloadInstagram();
         
      }
      if(WindowURL === 'https://www.instagram.com/'){
          localStorage.setItem('profileTabId',TabId);
          console.log("Yes the Profile is there Suvadeep");
          console.log("This is info from background",tab);
          data={userToken:UserToken,tabinfo:TabId,windowinfo:WindowId}
          console.log(data);
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
//   setInterval(function(){ 
//       chrome.tabs.query({url: "*://*.instagram.com/direct/inbox/"}, function(tab) {
//       chrome.tabs.reload(tab[0].id) 
//     });
//  }, 180000);
 
}

/** 
 * this will listen to the  on runtime Message
 * 
*/
const urlParam = "instaExt";
chrome.runtime.onMessage.addListener(async function(request, sender) {
if(request.type   ==  "postIndividualMessage")
  {
          messageLink = request.options.messageLink;
          messageId = messageLink.split("/").pop();
          messageUserName = request.options.userName;
          if(request.options.messageContent == 'Typing...')
          {
            return false;
          }
          messageContent =  getAutoResponseText(request.options.messageContent);
          
          console.log(messageContent);
          console.log('Id '+messageId);
          console.log('On BackGround '+messageUserName);
          console.log('Profile Tab '+localStorage.getItem("profileTabId"));
        
          chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
            url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${messageContent}&${urlParam}=true`,
            active: true}, function(tab) {
              tabId = tab.id;
            });
  
  }
    function getAutoResponseText(message)
    {
        let autoResponderKeywords = JSON.parse(localStorage.getItem('keywordsTally'));
        let responseMessage ='';
        for (var i = 0; i < autoResponderKeywords.length; i++) {
          let object = autoResponderKeywords[i];
              console.log(object.keyword+">>>");
              console.log(message+'#####');
              if (message.includes(object.keyword)) {
                   responseMessage = object.message;
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

    if(request.type   ==  "loadHomePage")
    {
      chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
        url: `https://www.instagram.com/${localStorage.getItem("fb_name")}`,
        active: true});
    }

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
                      localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
                      localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
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

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
    if (msg.ConFlag == "INDVAL"){
      let ListURL=localStorage.getItem('ListURLArray');
      let ListURLArray=JSON.parse(ListURL);
      if(ListURLArray.length  === 0){
        ListURLArray[ListURLArray.length]=mBasicUrl+""+ msg.SendURL;
        let NewListURLArray=JSON.stringify(ListURLArray);
        localStorage.setItem('ListURLArray', NewListURLArray);
      }else{
        let check = ListURLArray.includes(mBasicUrl+""+ msg.SendURL);
        if(check){

        }else{
        ListURLArray[ListURLArray.length]=mBasicUrl+""+ msg.SendURL;
        let NewListURLArray=JSON.stringify(ListURLArray);
        localStorage.setItem('ListURLArray', NewListURLArray);
        }
        
      }
      CheckLocalStoreAndHitIndividualMList();
    }
    if(msg.ConFlag == "CheckMessageContent"){
      console.log("Now  Again I am In BackGround xxxxxxxxxxxxxxxxxxxx",msg.MessageDetails);
      let fb_Name=localStorage.getItem('fb_username');
      let FacebookUserId=localStorage.getItem('fb_id');
      fb_Name=fb_Name.trim();
      let m_username=msg.MessageDetails.profile_name.trim();
      let ProfileLink=msg.MessageDetails.ProfileLink.trim();
      if(msg.MessageDetails.facebook_Id[0].trim() == FacebookUserId.trim()){
        FacebooKFriendId=msg.MessageDetails.facebook_Id[1].trim()
      }else{
        FacebooKFriendId=msg.MessageDetails.facebook_Id[0].trim()
      }
      if(fb_Name!=m_username){
        
        let fb_logged_id=localStorage.getItem('fb_logged_id');
        let inBackgroundFetching=localStorage.getItem('inBackgroundFetching');
        let default_message=localStorage.getItem('default_message');
        let autoresponder=localStorage.getItem('autoresponder');
        if(fb_logged_id == "true" && inBackgroundFetching== "false"){
          if(default_message !=0  ||  autoresponder!=0){
                let IncomingMessage = msg.MessageDetails.message_content.split(',').join(" , ");
                IncomingMessage = IncomingMessage.split('.').join("  ");
                IncomingMessage = IncomingMessage.split('?').join(" ");
                IncomingMessage = IncomingMessage.split('<br>').join(" ");
                IncomingMessage = IncomingMessage.split('`').join(" ");
                IncomingMessage = IncomingMessage.split("'").join(" ");
                IncomingMessage = IncomingMessage.split('"').join(" ");
                IncomingMessage = IncomingMessage.split('*').join(" ");
                IncomingMessage = IncomingMessage.split('’').join(" ");
                IncomingMessage = IncomingMessage.split('“').join(" ");
                IncomingMessage = IncomingMessage.split('”').join(" ");
                IncomingMessage = " "+IncomingMessage+" ";
                IncomingMessage=IncomingMessage.toLowerCase();
                let FriendFaceBookName=m_username;
                let UserFaceBookName=fb_Name;
                let AutoResponderKeyword=localStorage.getItem('keywordsTally');
                let MfenevanId  = localStorage.getItem('user_id');
                let keyObj = JSON.parse(AutoResponderKeyword);
                let FriendFullName = FriendFaceBookName.split(" ");
                let FirstCountx =0;
                let FriendFirstName ="";
                let FriendLastName ="";
                let NowTime=new Date().getTime();  
                if(FriendFullName.length>1){
                    FriendFullName.map(function(eachval){
                        if(FirstCountx ===   0){
                            FriendFirstName = eachval;
                        }else{
                            FriendLastName=FriendLastName+" "+eachval;
                        }
                        FirstCountx=FirstCountx+1;
                      });
                }else{
                    FriendFirstName = FriendFullName;
                }
                let totalkeyObj =keyObj.length;
                if(totalkeyObj == 0){
                  let paramsToSend  =   {
                    MfenevanId:MfenevanId,
                    FacebookUserId:FacebookUserId,
                    FriendFacebookId:FacebooKFriendId,
                    FacebookFirstName:FriendFirstName,
                    FacebookLastName:FriendLastName,
                    ProfileLink:ProfileLink,
                    TimeNow:NowTime
                  }
                  let response  = await handleRequest(
                    "api/friend/checkFriendReadyToReciveDefaultMessage",
                    method.POST,
                    toJsonStr(paramsToSend)
                    );
                  let responsenewvalue = await response.json();
                  console.log("Hit For Default",paramsToSend);
                  console.log("Hit For Default Now Get From Backend",responsenewvalue);
                }else{
                  let ResponseTextArray=[];
                  let ResponseText="";
                  await keyObj.map(function(eachval){
                    let keywordToFind =eachval.keyword.toLowerCase();
                        keywordToFind = " "+keywordToFind+" ";
                        if (IncomingMessage.indexOf(keywordToFind)!=-1)
                        {
                              let PointIndex=IncomingMessage.indexOf(keywordToFind);
                              ResponseTextArray[PointIndex] = eachval.message
                              
                        }
                    });

                    if(ResponseTextArray.length === 0){
                      let paramsToSend  =   {
                        MfenevanId:MfenevanId,
                        FacebookUserId:FacebookUserId,
                        FriendFacebookId:FacebooKFriendId,
                        FacebookFirstName:FriendFirstName,
                        FacebookLastName:FriendLastName,
                        ProfileLink:ProfileLink,
                        TimeNow:NowTime
                      }
                      let response  = await handleRequest(
                        "api/friend/checkFriendReadyToReciveDefaultMessage",
                        method.POST,
                        toJsonStr(paramsToSend)
                        );
                      let responsenewvalue = await response.json();
                      if(responsenewvalue.code == 1){
                        console.log("Hey I am Sending This-----------------------",paramsToSend);
                        port.postMessage({userInfoDetails: responsenewvalue.payload.message,ThreadParams:paramsToSend,ConFlagBack:"DEFAULTMESSAGEBACK" });
                      }else{
                        let individualThreadList  = JSON.parse(localStorage.getItem('ListURLArray'));
                        let indexthreadlink = individualThreadList.indexOf(msg.MessageDetails.location_details);
                        if (indexthreadlink !== -1) {
                          individualThreadList.splice(indexthreadlink, 1);
                          let NewListURLArray=JSON.stringify(individualThreadList);
                          localStorage.setItem('ListURLArray', NewListURLArray);
                         // document.getElementById('messageIndividualMain').src ="";
                          localStorage.setItem('CheckMessageNReply',0);
                          CheckLocalStoreAndHitIndividualMList();
                        }
                        
                      }
                    }else{
                      ResponseTextArray.map(eachRespo=>{
                        ResponseText=ResponseText+" "+eachRespo;
                      });
                        let a = new Date(NowTime);
                        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        let year = a.getFullYear();
                        let month = months[a.getMonth()];
                        let date = a.getDate();
                        let hour = a.getHours();
                        let min = a.getMinutes();
                        let sec = a.getSeconds();
                        let OnlyDate = date + ' ' + month + ' ' + year ;
                        let NewResponseText = ResponseText.split('{first_name}').join(FriendFirstName);
                        NewResponseText = NewResponseText.split('{last_name}').join(FriendLastName);
                        NewResponseText = NewResponseText.split('{Date}').join(OnlyDate);
                        NewResponseText = NewResponseText.split('{date}').join(OnlyDate);
                        //console.log("Message Array IS++++++++++++++++++++++++",NewResponseText);
                        let paramsToSend  =   {
                          MfenevanId:MfenevanId,
                          FacebookUserId:FacebookUserId,
                          FriendFacebookId:FacebooKFriendId,
                          FacebookFirstName:FriendFirstName,
                          FacebookLastName:FriendLastName,
                          ProfileLink:ProfileLink,
                          TimeNow:NowTime
                        }
                        console.log("Hey I am Sending This------------------",paramsToSend);
                        port.postMessage({userInfoDetails: NewResponseText,ThreadParams:paramsToSend,ConFlagBack:"AUTOMESSAGEBACK" });
                    }
                }
                

          }else{
              let individualThreadList  = JSON.parse(localStorage.getItem('ListURLArray'));
              let indexthreadlink = individualThreadList.indexOf(msg.MessageDetails.location_details);
              if (indexthreadlink !== -1) {
                individualThreadList.splice(indexthreadlink, 1);
                let NewListURLArray=JSON.stringify(individualThreadList);
                localStorage.setItem('ListURLArray', NewListURLArray);
               // document.getElementById('messageIndividualMain').src ="";
                localStorage.setItem('CheckMessageNReply',0);
                CheckLocalStoreAndHitIndividualMList();
              }
            
          }
        }else{
              let individualThreadList  = JSON.parse(localStorage.getItem('ListURLArray'));
              let indexthreadlink = individualThreadList.indexOf(msg.MessageDetails.location_details);
              if (indexthreadlink !== -1) {
                individualThreadList.splice(indexthreadlink, 1);
                let NewListURLArray=JSON.stringify(individualThreadList);
                localStorage.setItem('ListURLArray', NewListURLArray);
                //document.getElementById('messageIndividualMain').src ="";
                localStorage.setItem('CheckMessageNReply',0);
                CheckLocalStoreAndHitIndividualMList();
              }
         
        }
      }else{
              let individualThreadList  = JSON.parse(localStorage.getItem('ListURLArray'));
              let indexthreadlink = individualThreadList.indexOf(msg.MessageDetails.location_details);
              if (indexthreadlink !== -1) {
                individualThreadList.splice(indexthreadlink, 1);
                let NewListURLArray=JSON.stringify(individualThreadList);
                localStorage.setItem('ListURLArray', NewListURLArray);
                //document.getElementById('messageIndividualMain').src ="";
                localStorage.setItem('CheckMessageNReply',0);
                CheckLocalStoreAndHitIndividualMList();
              }
        
      }
    }
    if(msg.ConFlag == "STOREANDCLOSE"){
      let params  =   {
        FacebookFirstName : msg.MessageDetails.FacebookFirstName,
        FacebookLastName  :msg.MessageDetails.FacebookLastName,
        FacebookUserId  :msg.MessageDetails.FacebookUserId,
        FriendFacebookId  :msg.MessageDetails.FriendFacebookId,
        MessageSenderType :msg.MessageDetails.MessageSenderType,
        MfenevanId  :msg.MessageDetails.MfenevanId,
        ProfileLink :msg.MessageDetails.ProfileLink,
        ResponseMessage :msg.MessageDetails.ResponseMessage,
        ResponseTime  :msg.MessageDetails.ResponseTime
      }
      let response = await handleRequest(
        "api/friend/saveLastMessageOutForFriend",
        method.POST,
        toJsonStr(params)
      );
      let individualThreadList  = JSON.parse(localStorage.getItem('ListURLArray'));
      let indexthreadlink = individualThreadList.indexOf(msg.MessageDetails.LocationDetails);
      if (indexthreadlink !== -1) {
        individualThreadList.splice(indexthreadlink, 1);
        let NewListURLArray=JSON.stringify(individualThreadList);
        localStorage.setItem('ListURLArray', NewListURLArray);
        //document.getElementById('messageIndividualMain').src ="";
        localStorage.setItem('CheckMessageNReply',0);
        CheckLocalStoreAndHitIndividualMList();
      }
      
      // if(individualThreadList.length != 0){
      //   let NewIndividualThreadLinksx = [];
      //   let i=0;
      //   await individualThreadList.map(async function(eachval){
      //     if(eachval==msg.MessageDetails.LocationDetails){
            
      //     }else{
      //       NewIndividualThreadLinksx[i]=msg.MessageDetails.LocationDetails;
      //       i=i+1;
      //     }
      //   });
      //   document.getElementById('messageIndividualMain').src ="";
      //   localStorage.setItem('ListURLArray',NewIndividualThreadLinksx);
      //   localStorage.setItem('CheckMessageNReply',0);
      //   CheckLocalStoreAndHitIndividualMList();
      // }

      console.log("Now  Again I am In BackGround 332",msg.MessageDetails);
      console.log("Now  i have  to send this in db from BackGround 344",params);
    }
  });
});
async function TallyWithKeyWordsOrDefault(IncomingMessage,FriendFaceBookName,FacebooKFriendId,UserFaceBookName,FacebookUserId,ProfileLink){
  //let port = chrome.runtime.connect({name: "knockknock"});
  let AutoResponderKeyword=localStorage.getItem('keywordsTally');
  let MfenevanId  = localStorage.getItem('user_id');
  let keyObj = JSON.parse(AutoResponderKeyword);
  let FriendFullName = FriendFaceBookName.split(" ");
  let FirstCountx =0;
  let FriendFirstName ="";
  let FriendLastName ="";
  let NowTime=new Date().getTime();  
  if(FriendFullName.length>1){
      FriendFullName.map(function(eachval){
          if(FirstCountx ===   0){
              FriendFirstName = eachval;
          }else{
              FriendLastName=FriendLastName+" "+eachval;
          }
          FirstCountx=FirstCountx+1;
        });
  }else{
      FriendFirstName = FriendFullName;
  }
  console.log("I Got This Keywords Count ))))))",keyObj.length);
  let totalkeyObj =keyObj.length;
  if(totalkeyObj == 0){
     
    let paramsToSend  =   {
      MfenevanId:MfenevanId,
      FacebookUserId:FacebookUserId,
      FriendFacebookId:FacebooKFriendId,
      FacebookFirstName:FriendFirstName,
      FacebookLastName:FriendLastName,
      ProfileLink:ProfileLink,
      TimeNow:NowTime
    }
    let response  = await handleRequest(
      "api/friend/checkFriendReadyToReciveDefaultMessage",
      method.POST,
      toJsonStr(paramsToSend)
      );
    let responsenewvalue = await response.json();
    console.log("Hit For Default",paramsToSend);
    console.log("Hit For Default Now Get From Backend",responsenewvalue);
    
  }else{
    let ResponseTextArray=[];
    let ResponseText="";
    await keyObj.map(function(eachval){
      let keywordToFind =eachval.keyword.toLowerCase();
          keywordToFind = " "+keywordToFind+" ";
          if (IncomingMessage.indexOf(keywordToFind)!=-1)
          {
                let PointIndex=IncomingMessage.indexOf(keywordToFind);
                ResponseTextArray[PointIndex] = eachval.message
                
          }
      });
    
    console.log("Hit For Keyword Check",keyObj.length);
    console.log("Message Array IS",ResponseTextArray);
    if(ResponseTextArray.length === 0){
      
      let paramsToSend  =   {
        MfenevanId:MfenevanId,
        FacebookUserId:FacebookUserId,
        FriendFacebookId:FacebooKFriendId,
        FacebookFirstName:FriendFirstName,
        FacebookLastName:FriendLastName,
        ProfileLink:ProfileLink,
        TimeNow:NowTime
      }
      let response  = await handleRequest(
        "api/friend/checkFriendReadyToReciveDefaultMessage",
        method.POST,
        toJsonStr(paramsToSend)
        );
      let responsenewvalue = await response.json();
      console.log("Hit For Default",paramsToSend);
      console.log("Hit For Default Now Get From Backend",responsenewvalue);
      if(responsenewvalue.code == 1){
        return {userInfoDetails: responsenewvalue,ConFlagBack:"DEFAULTMESSAGEBACK" };
      }else{
            //TODO Remove  from Link Array,Remove From IFrame and CheckMessageNReply ==0
            console.log("TODO Remove  from Link Array,Remove From IFrame and CheckMessageNReply ==0");

      }
      
    }else{
      ResponseTextArray.map(eachRespo=>{
        ResponseText=ResponseText+" "+eachRespo;
      });
        let a = new Date(NowTime);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let OnlyDate = date + ' ' + month + ' ' + year ;
      let NewResponseText = ResponseText.split('{first_name}').join(FriendFirstName);
        NewResponseText = NewResponseText.split('{last_name}').join(FriendLastName);
        NewResponseText = NewResponseText.split('{Date}').join(OnlyDate);
        NewResponseText = NewResponseText.split('{date}').join(OnlyDate);
      console.log("Message Array IS++++++++++++++++++++++++",NewResponseText);
      return {userInfoDetails: NewResponseText,ConFlagBack:"AUTOMESSAGEBACK" };
    }
  }
}
function CheckLocalStoreAndHitIndividualMList(){
  let ListURL=localStorage.getItem('ListURLArray');
  let CheckMessageNReply=localStorage.getItem('CheckMessageNReply');
  let fb_logged_id=localStorage.getItem('fb_logged_id');
  let inBackgroundFetching=localStorage.getItem('inBackgroundFetching');
  let default_message=localStorage.getItem('default_message');
  let autoresponder=localStorage.getItem('autoresponder');
  console.log("Trigger ===========1",ListURL);
  console.log("Trigger ===========2",CheckMessageNReply);
  console.log("Trigger ===========3",fb_logged_id);
  console.log("Trigger ===========4",inBackgroundFetching);
  console.log("Trigger ===========5",default_message);
  console.log("Trigger ===========6",autoresponder);
  if(fb_logged_id == "true" && inBackgroundFetching== "false"){
    if(default_message !=0  ||  autoresponder!=0){
      if(CheckMessageNReply == 0){

        let ListURLArray = JSON.parse(ListURL);
        console.log("Trigger ===========77",ListURLArray);
        if(ListURLArray.length>0){
          console.log("Trigger ===========7",ListURLArray[0]);
          //document.getElementById('messageIndividualMain').src = "";
          //document.getElementById('messageIndividualMain').src = ListURLArray[0];
          localStorage.setItem('CheckMessageNReply',1);
        }
        
      }
    }
  }

}

