const getApiUrl = "https://api.grammywammy.com/"; //"https://api.mefnevan.com" ;
const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);
let AutoResponderState = localStorage.getItem('autoresponder');
let DefaultMessageState = localStorage.getItem('default_message');
console.log(AutoResponderState+'&&&&'+DefaultMessageState);
const getUserToken = () => localStorage.getItem("kyubi_user_token");
console.log('We are on background');
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


const manifest = chrome.runtime.getManifest();

function installContentScript() {
  // iterate over all content_script definitions from manifest
  // and install all their js files to the corresponding hosts.
  let contentScripts = manifest.content_scripts;
  for (let i = 0; i < contentScripts.length; i++) {
    let contScript = contentScripts[i];
    chrome.tabs.query({ url: contScript.matches }, function(foundTabs) {
      for (let j = 0; j < foundTabs.length; j++) {
        let javaScripts = contScript.js;
        for (let k = 0; k < javaScripts.length; k++) {
          chrome.tabs.executeScript(foundTabs[j].id, {
            file: javaScripts[k]
          });          
        }
      }
    });
  }
}

chrome.runtime.onInstalled.addListener(installContentScript);


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
          resetStatus();
          
         
      }
      if(WindowURL === 'https://www.instagram.com/'){

          /// For Setting List Id Array ///
          let ListIdArray =[];
          let NewListIdArray=JSON.stringify(ListIdArray);
          localStorage.setItem('ListIdArray', NewListIdArray);
          localStorage.setItem('CheckMessageNReply',0);
          /// For Setting List Id Array ///

          localStorage.setItem('profileTabId',TabId);
          console.log("Yes the Profile is there Suvadeep");
          console.log("This is info from background",tab);
          data={userToken:UserToken,tabinfo:TabId,windowinfo:WindowId}
          console.log(data);
          chrome.tabs.sendMessage(TabId, { catch: "get-login-info",data });

          
      }
     
     
  }
});

function resetStatus(){
 
  setInterval(function(){ 
    console.log('called');
    localStorage.setItem('CheckMessageNReply',0);
  }, 20000);

}



/** 
 * this will listen to the  on runtime Message
 * 
*/

chrome.runtime.onMessage.addListener(async function(request, sender) {
 
  if (request.type == "storeUserInfoOrQueryThenStore"){
        console.log("This I Got In Background",request.options);
        getInstagramId(request.options.insta_username);
        let  params ={
        user_rec    :   localStorage.getItem('kyubi_user_token'),
        fb_id       :   localStorage.getItem('instagramIdForTheLoggedInUser'),
        fb_username :   request.options.insta_username,
        fb_name     :   request.options.insta_name,
        fb_image    :  request.options.insta_image,
        fb_logged_id :   request.options.insta_logged_id
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
                      // localStorage.setItem('ListURLArray', urlArray);
                      localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                      localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                      localStorage.setItem('insta_id', responsenewvalue.payload.UserInfo.facebook_fbid);
                      localStorage.setItem('insta_username', responsenewvalue.payload.UserInfo.facebook_profile_name);
                      localStorage.setItem('insta_name', responsenewvalue.payload.UserInfo.facebook_name);
                      localStorage.setItem('insta_image', responsenewvalue.payload.UserInfo.facebook_image);
                      localStorage.setItem('insta_logged_id', request.options.insta_logged_id);
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

            /** For getting instagram id of the logged in user */
            function getInstagramId(userName)
            {
              
                var regex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/);
                var validation = regex.test(userName);
                if(validation) {
                  $.get("https://www.instagram.com/"+userName+"/?__a=1")
                  .done(function(data) { 
                   var instagramId = data["graphql"]["user"]["id"];
                   localStorage.setItem("instagramIdForTheLoggedInUser",instagramId);
                  })
                  .fail(function() { 
                    // code for 404 error 
                    console.log('Username was not found!')
                  })
                
                } else {
                  console.log('The username is invalid!')
                }
            }
          /** For getting instagram id of the logged in user */
    

    }
})

const urlParam = "instaExt";
chrome.runtime.onConnect.addListener(function(port) {
  //if (port.name === 'knockknock') {
    port.onMessage.addListener(async function(msg) {
    if (msg.ConFlag == "CheckMessageContent")
      {
              console.log('Reached Here');
              messageId = msg.options.messageId;
              console.log('Reached Here1');
              
              messageUserName = msg.options.userName;
              console.log('Reached Here3');
              console.log(msg.options.messageContent);
              console.log('Before Calling the function');
              getAutoResponseText(msg.options.messageContent,messageUserName,messageId);
        }

        function getAutoResponseText(message,userName,messageId)
        {
          console.log('Reached The Function');
          var regex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/);
          var validation = regex.test(userName);
          if(validation) {
            $.get("https://www.instagram.com/"+userName+"/?__a=1")
            .done(function(data) { 
  
              var userFullName = data["graphql"]["user"]["full_name"];
              let autoResponderKeywords = JSON.parse(localStorage.getItem('keywordsTally'));
              let responseMessage ='';
                  for (var i = 0; i < autoResponderKeywords.length; i++) {
                    let object = autoResponderKeywords[i];
                        let userMessage = message.toLowerCase();
                        let individualKeyword = object.keyword.toLowerCase();
                        console.log(`${userMessage} is the usermessage`);
                        console.log(`${individualKeyword} is the keyword`);
                        if (userMessage.includes(individualKeyword)) {
                            console.log('Condition Satisfied');
                           
                            let splitFullName = userFullName.split(" ");
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
                    console.log('Auto Responder '+AutoResponderState);
                    console.log('Default Message '+DefaultMessageState);
                    // if((AutoResponderState == 1 || DefaultMessageState == 1))
                    // {
                      chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                      url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${responseMessage}&${urlParam}=true`,
                      active: true}, function(tab) {
                        tabId = tab.id;
                      });
                    //}
                  }
                  else
                  {
                    getDefaultMessage(userName,messageId);
                    return localStorage.getItem('defaultMessageFromBackend');
                  }
              
              
              })
            .fail(function() { 
              // code for 404 error 
              console.log('Username was not found!')
            })
          
          } else {
            console.log('The username is invalid!')
          }
           
        }


        function getDefaultMessage(userName,messageId)
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
                        
                        let GrammyWammyId  = localStorage.getItem('user_id');
                        let NowTime=new Date().getTime();  

                        let splitFullName = userFullName.split(" ");
                        let firstName = (splitFullName[0]) ? splitFullName[0] :'';
                        let lastName = (splitFullName[1]) ? (splitFullName[1]) : '';
                        let postedByUsername = userName;
                        let profileLink = `https://www.instagram.com/${userName}`;
                        let instagramFriendId = userId;

                        let paramsToSend  =   {
                          MfenevanId:GrammyWammyId,
                          FacebookUserId:localStorage.getItem('instagramIdForTheLoggedInUser'),
                          FriendFacebookId:instagramFriendId,
                          FacebookFirstName:firstName,
                          FacebookLastName:lastName,
                          ProfileLink:profileLink,
                          Username: postedByUsername,
                          TimeNow:NowTime
                        }

                          console.log('Params To Send '+firstName);

                          let response  =  handleRequest(
                          "api/friend/checkFriendReadyToReciveDefaultMessage",
                          method.POST,
                          toJsonStr(paramsToSend)
                          ).then(async response =>  {
                            let responsenewvalue = await response.json();
                            console.log("Hit For Default",paramsToSend);
                            console.log("Hit For Default Now Get From Backend",responsenewvalue.payload.message);
                            console.log("The whole payload",responsenewvalue);
                            // if((AutoResponderState == 1 || DefaultMessageState == 1))
                            // {
                                if(responsenewvalue.code === 2)
                                {
                                  var messageContent = '';
                                  chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                                  url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${messageContent}&${urlParam}=true`,
                                  active: true}, function(tab) {
                                    tabId = tab.id;
                                  });
                                }
                                if(responsenewvalue.code === 1)
                                {
                                  
                                  port.postMessage({userInfoDetails: responsenewvalue.payload.message,ThreadParams:paramsToSend,ConFlagBack:"DEFAULTMESSAGEBACK" });
                                  var messageContent = responsenewvalue.payload.message;
                                  chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                                  url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${messageContent}&${urlParam}=true`,
                                  active: true}, function(tab) {
                                    tabId = tab.id;
                                  });
                                }
                          //}

                          }).catch(error=>{
                          } )
                        
                  })
                  .fail(function() { 
                    // code for 404 error 
                    console.log('Username was not found!')
                  })
                
                } else {
                  console.log('The username is invalid!')
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
         // let indexthreadlink = individualThreadList.indexOf(msg.MessageDetails.LocationDetails);
          // if (indexthreadlink !== -1) {
          //   individualThreadList.splice(indexthreadlink, 1);
          //   let NewListURLArray=JSON.stringify(individualThreadList);
          //   localStorage.setItem('ListURLArray', NewListURLArray);
          //   localStorage.setItem('CheckMessageNReply',0);
          //   CheckLocalStoreAndHitIndividualMList();
          // }
          
          console.log("Now  Again I am In BackGround 332",msg.MessageDetails);
          console.log("Now  i have  to send this in db from BackGround 344",params);
        }  

        
      if(msg.ConFlag   ==  "loadHomePage")
        {
         
          chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
            url: `https://www.instagram.com/${localStorage.getItem("insta_username")}`,
            active: false});
            localStorage.setItem('CheckMessageNReply',0);

            
            console.log('Came From Content '+msg.options.messageId);
            // splice(checkedTweetsArrayIndex, 1);
            let ListId=JSON.parse(localStorage.getItem('ListIdArray'));
            const listIdArrayIndex = ListId.indexOf(msg.options.messageId);

            if (listIdArrayIndex > -1) {
              ListId.splice(listIdArrayIndex, 1);
            } 

            localStorage.setItem("ListIdArray", JSON.stringify(ListId));
            CheckLocalStoreAndHitIndividualMList();
            // chrome.tabs.update( parseInt(localStorage.getItem("messageListId")), { 
            //   url: `https://www.instagram.com/direct/inbox/`,
            //   active: true});
        }
        /// For Storing Message Id's To An Array ///
        if(msg.ConFlag   ==  "StoreMessageLinkInLocalStorage")
        {
              console.log('store here');
              let ListId=localStorage.getItem('ListIdArray');
              let ListIdArray=JSON.parse(ListId);
              if(ListIdArray.length  === 0)
              {
                  ListIdArray[ListIdArray.length]= msg.options;
                  let NewListIdArray=JSON.stringify(ListIdArray);
                  localStorage.setItem('ListIdArray', NewListIdArray);
              }
              else
              {
                  let check = ListIdArray.includes(msg.options);
                  if(check){

                  }else{
                  ListIdArray[ListIdArray.length]=msg.options;
                  let NewListIdArray=JSON.stringify(ListIdArray);
                  localStorage.setItem('ListIdArray', NewListIdArray);
                  }
            }
            CheckLocalStoreAndHitIndividualMList();
        }
        /// For Storing Message Id's To An Array ///

       ///  For showing indivdual Message Thread ///

       function CheckLocalStoreAndHitIndividualMList(){
       
        let ListId=localStorage.getItem('ListIdArray');
        let CheckMessageNReply=localStorage.getItem('CheckMessageNReply');
        let insta_logged_id=localStorage.getItem('insta_logged_id');
        let default_message=localStorage.getItem('default_message');
        let autoresponder=localStorage.getItem('autoresponder');
        if(insta_logged_id == "true"){
          if(default_message !=0  ||  autoresponder!=0){
            if(CheckMessageNReply == 0){
              
              let ListIdArray = JSON.parse(ListId);
              if(ListIdArray.length>0){
              console.log("Trigger ===========7",ListIdArray[0]);
              localStorage.setItem('CheckMessageNReply',1);
              let statusMessage = 'Read Message';
              chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                  url: `https://www.instagram.com/direct/inbox/?id=${ListIdArray[0]}&message=${statusMessage}&${urlParam}=true`,
                  active: true}, function(tab) {
                    tabId = tab.id;
                  });
              }
              
            }
          }
        }
      
      }

       ///  For showing indivdual Message Thread ///
        
  });
//}
});


