const getApiUrl = "http://localhost:8080/"; //"https://api.mefnevan.com" ;
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
          //scanForNewMessage();
          
         
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
              messageLink = msg.options.messageLink;
              messageId = messageLink.split("/").pop();
              messageUserName = msg.options.userName;
              //setUserDetails(messageUserName);
              if(msg.options.messageContent == 'Typing...')
              {
                chrome.windows.getCurrent(w => {
                  chrome.tabs.query({active: true, windowId: w.id}, tabs => {
                    const tabId = tabs[0].id;
                    data={}
                    chrome.tabs.sendMessage(tabId, { catch: "check-new-incoming-message",data });
                    
                  });
                });
                return false;
              }
              setTimeout(function () {
              messageContent =  getAutoResponseText(msg.options.messageContent,messageUserName,messageId);
            
              // chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
              //   url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${messageContent}&${urlParam}=true`,
              //   active: true}, function(tab) {
              //     tabId = tab.id;
              //   });
              
              }, 1000);
      
      }
        function getAutoResponseText(message,userName,messageId)
        {
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
                            //console.log('Details '+localStorage.getItem("individualMessageDetails"));
                          // console.log('Username'+userName);
                            
                                //console.log('no stored');
                           
                           
                            //console.log(fullName+' Full Name');
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
                      chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                      url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${responseMessage}&${urlParam}=true`,
                      active: true}, function(tab) {
                        tabId = tab.id;
                      });
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
                            
                            if(responsenewvalue.code === 2)
                            {
                              var messageContent = 'Failed';
                              chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                              url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${messageContent}&${urlParam}=true`,
                              active: true}, function(tab) {
                                tabId = tab.id;
                              });
                            }
                            if(responsenewvalue.code === 1)
                            {
                              
                              port.postMessage({userInfoDetails: responsenewvalue.payload.message,ThreadParams:paramsToSend,ConFlagBack:"DEFAULTMESSAGEBACK" });
                              //localStorage.setItem("defaultMessageFromBackend",responsenewvalue.payload.message);
                              var messageContent = responsenewvalue.payload.message;
                              chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
                              url: `https://www.instagram.com/direct/inbox/?id=${messageId}&message=${messageContent}&${urlParam}=true`,
                              active: true}, function(tab) {
                                tabId = tab.id;
                              });
                            }

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

        
      if(msg.ConFlag   ==  "loadHomePage")
        {
         
          chrome.tabs.update( parseInt(localStorage.getItem("profileTabId")), { 
            url: `https://www.instagram.com/${localStorage.getItem("fb_username")}`,
            active: false});

            chrome.tabs.update( parseInt(localStorage.getItem("messageListId")), { 
              url: `https://www.instagram.com/direct/inbox/`,
              active: true});
        }
        
  });
//}
});


