const getApiUrl = "http://localhost:8008"; //"https://api.mefnevan.com" ;

const method = { POST: "post", GET: "get", PUT: "put", DELETE: "delete" };
const toJsonStr = (val) => JSON.stringify(val);

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
      // mode: 'no-cors',
      method: methodType,
      headers: getWithCredentialHeader,
      body: bodyData,
    });
};

chrome.runtime.onMessage.addListener(async function(request, sender) {
  console.log("This is the Request =========>",request)
  if (request.type == "storeUserInfoOrQueryThenStore"){
    
    

    let user_rec= localStorage.getItem('kyubi_user_token');
    let UserInstaGramid =request.options.UserInstaGramid;
    let UserInstaGramUsername=request.options.UserInstaGramUsername;
    let UserInstaGramName =request.options.UserInstaGramName;
    let UserInstaGramImage =request.options.UserInstaGramImage;
    let UserLoggedInInstaGram =request.options.UserLoggedInInstaGram;
    if(UserLoggedInInstaGram === true){
    await $.get("https://www.instagram.com/"+UserInstaGramUsername+"/?__a=1")
      .done(function(data) {

        UserInstaGramid =data["graphql"]["user"]["id"];
      })
      .fail(function() { 
      // code for 404 error 
        console.log('Username was not found!')
      })
    }

    let  params ={
      user_rec    :   user_rec,
      fb_id       :   UserInstaGramid,
      fb_username :   UserInstaGramUsername,
      fb_name     :   UserInstaGramName,
      fb_image    :   UserInstaGramImage,
      fb_logged_id :  UserLoggedInInstaGram
    };
    console.log("This I Wana Send to Background",params);
    await handleRequest(
      "/api/user/userCheckStoreNRetrive",
      method.POST,
      toJsonStr(params)
      ).then(async response =>  {
        let responsenewvalue = await response.json();
        console.log("I already Got the Info",responsenewvalue);
        let  urlArray="[]";
                      console.log("This from DB",responsenewvalue);
                      localStorage.setItem('CheckMessageNReply', 0);
                      // localStorage.setItem('ListURLArray', urlArray);
                      localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                      localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                      localStorage.setItem('insta_id', responsenewvalue.payload.UserInfo.instagram_fbid);
                      localStorage.setItem('insta_username', responsenewvalue.payload.UserInfo.instagram_profile_name);
                      localStorage.setItem('insta_name', responsenewvalue.payload.UserInfo.instagram_name);
                      localStorage.setItem('insta_image', responsenewvalue.payload.UserInfo.instagram_image);
                      localStorage.setItem('insta_logged_id', request.options.UserLoggedInInstaGram);
                      localStorage.setItem('inBackgroundFetching', false);
                      let AutoResponderStatus = 0; 
                      let DefaultMessageStatus =0;
                      UserLoggedInInstaGram=UserLoggedInInstaGram;
                      let BackGroundFetchingStatus  =false;
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
                      console.log("In ZeroOne",AutoResponderStatus);
                      console.log("In ZeroTwo",DefaultMessageStatus);
                      console.log("In ZeroThree",UserLoggedInInstaGram);
                      console.log("In ZeroFour",BackGroundFetchingStatus);
                      if((AutoResponderStatus == 1 || DefaultMessageStatus == 1) && UserLoggedInInstaGram== true && BackGroundFetchingStatus==  false ){
                        console.log("In Zero");
                        if(localStorage.getItem('instamunread')){
                          console.log("In ONE");
                          let newtab=parseInt(localStorage.getItem('instamunread'));
                          chrome.tabs.get(newtab, function(tab) {
                            if (!tab) { 
                              //console.log('tab does not exist'); 
                              const myNewUrl  =   `https://www.instagram.com/direct/inbox/`;
                              let CreateTab    =   chrome.tabs.create({
                                  url: myNewUrl,
                                  active: trueo,
                                  pinned:true
                              },function(tab) { 
                                  let instamunread=tab.id;
                                  localStorage.setItem('instamunread', instamunread);
                                  
                              });
                            }
                          })
                        }else{
                            const myNewUrl  =   `https://www.instagram.com/direct/inbox/`;
                            let CreateTab    =   chrome.tabs.create({
                                  url: myNewUrl,
                                  active: true,
                                  pinned:true
                            },function(tab) { 
                                  let instamunread=tab.id;
                                  localStorage.setItem('instamunread', instamunread);
                                  
                            });
                        }
                      }

      }).catch(error =>{
        console.log("I already Got the Info But Its Error ====>",error);

      })

  }
  if(request.type == "TrigerTheDeburger"){
    console.log("This is inside deburger");
    
    if(request.options == "Listing" && sender.tab.id == parseInt(localStorage.getItem('instamunread'))){
      console.log("I am Called sssssssssssssssssssssss",request);
      console.log("I am Called sssssssssssssssssssssss",sender);
      let ListingTabId=sender.tab.id;
      // chrome.debugger.attach({ tabId: ListingTabId }, "1.3", function () {
      //   chrome.debugger.sendCommand(
      //     { tabId: ListingTabId },
      //     "Page.bringToFront",function () {
      //       console.log("Hello Page Enabled +++++++")
            chrome.tabs.sendMessage(ListingTabId,{type: "StartTheMutation", options: ListingTabId}); 
      //       chrome.debugger.detach({ tabId: ListingTabId });  
               

      //     });
      // })
    }
    if(request.options == "Profile"){
      console.log("I am Called",request.options);
      let ProfileTabId=sender.tab.id;
      // chrome.debugger.attach({ tabId: ProfileTabId }, "1.3", function () {
      //   chrome.debugger.sendCommand(
      //     { tabId: ProfileTabId },
      //     "Page.bringToFront",function () {
      //       console.log("Hello Profile Page Enabled +++++++")
            chrome.tabs.sendMessage(ProfileTabId,{type: "StartTheProfileGrabing", options: ProfileTabId}); 
      //       chrome.debugger.detach({ tabId: ProfileTabId });           
      //     });
      // })
    }
    
  }
  if(request.type == "TrigerTheDeburgerIndividual"){
    if(request.potions !== "Individual"){
      console.log("This is inside Individual");
      console.log("This is for the message Individual 1",sender);
      let instaIndividualMessage=localStorage.getItem('instaIndividualMessage');
      console.log("This is for the message Individual 2",sender.tab.windowId);
      console.log("This is a info from localstorage",instaIndividualMessage);
      if(sender.tab.windowId == instaIndividualMessage){
        if(localStorage.getItem('ListIdArray')){
          let ListURL=localStorage.getItem('ListIdArray');
          let ListURLArray = JSON.parse(ListURL);
          if(ListURLArray.length===0){
            localStorage.setItem('CheckMessageNReply',0);
          }else{
            let myMessageUrl  =   ListURLArray[0];  
            chrome.tabs.sendMessage(sender.tab.id,{type: "StartTheRestGrabing", options: myMessageUrl});
          }
        }
        
      }
       
    }
  }
  if(request.type == "TrigerReader"){
    console.log("I am Inside Trigger Reader =========>",request.options);
    // chrome.debugger.attach({ tabId: sender.tab.id }, "1.3", function () {
    //   chrome.debugger.sendCommand(
    //     { tabId: sender.tab.id },
    //     "Page.bringToFront",function () {
    //       console.log("Hello Profile Page Enabled +++++++")
          chrome.tabs.sendMessage(sender.tab.id,{type: "GrabMessageAndDetails", options: request.options});
    //       chrome.debugger.detach({ tabId: sender.tab.id });           
    //     });
    // })
   
  }
  if(request.type == "CheckMessageAndResponse"){
    console.log("I am Inside CheckMessageAndResponse =========>",request.options);
    if(request.options.TotalMessageCount != 0){
      let TotalMessageValuesCount=request.options.UseMessage.length - 1;
      let InstaUserName=request.options.UserLink.split('/').join("");
      InstaUserName=InstaUserName.split('/').join("");
      let MessageType=0;
      let InstaUser=request.options.UserId;
      let InstaUserImage=request.options.UserImages;
      let InstaUserLink=request.options.UserLink;
      
      console.log("This is the Message count Value",TotalMessageValuesCount);
      console.log("This is the Message count Value",TotalMessageValuesCount);
      let Message = "";
      let CountrNum =0;
      let ResponseTextArray=[];
      for (var i = TotalMessageValuesCount; i >= 0; i--) {
        console.log(i);
        console.log("This is the Message Indvidual",request.options.UseMessage[i]);
        if(request.options.UseMessage[i][0]===2){
                let keywordToFind =request.options.UseMessage[i][1];
                let IncomingMessage = keywordToFind.split(',').join(" , ");
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
                IncomingMessage = IncomingMessage.split('!').join(" ");
                IncomingMessage = IncomingMessage.split('@').join(" ");
                IncomingMessage = IncomingMessage.split('#').join(" ");
                IncomingMessage = IncomingMessage.split('%').join(" ");
                IncomingMessage = IncomingMessage.split('&').join(" ");
                IncomingMessage = IncomingMessage.split('*').join(" ");
                IncomingMessage = IncomingMessage.split('^').join(" ");
                IncomingMessage = IncomingMessage.trim();
                IncomingMessage=" " + IncomingMessage.toLowerCase()+" ";

                if(ResponseTextArray.length === 0){
                  Message = Message + " " + IncomingMessage;
                  ResponseTextArray[CountrNum] =IncomingMessage;
                  CountrNum++;
                }else{
                  if (ResponseTextArray.indexOf(IncomingMessage)!=-1){
                    console.log("Found")
                  }else{
                    ResponseTextArray[CountrNum] =IncomingMessage;
                    Message = Message + " " + IncomingMessage;
                    CountrNum++;
                    console.log("Cant Found")
                    
                  }
                }
        }else{
          break;
        }
      }
     
      console.log("This is the Message",ResponseTextArray);
      let AutoResponderKeyword=localStorage.getItem('keywordsTally');
      let keyObj = JSON.parse(AutoResponderKeyword);
      let NowTime=new Date().getTime(); 
      let totalkeyObj =keyObj.length;
      if(totalkeyObj == 0){
        console.log("Restart The Process ==========>")
        let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
        let indexthreadlink = individualThreadList.indexOf(InstaUser);
        if (indexthreadlink !== -1) {
          individualThreadList.splice(indexthreadlink, 1);
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }else{
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }
      
        chrome.tabs.remove(sender.tab.id);
        localStorage.removeItem('instaIndividualMessage');
        localStorage.setItem('CheckMessageNReply',0);
        checkIndividualMessage();
      }else{
        if(ResponseTextArray.length == 0){
          console.log("Restart The Process ==========>")
          let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
          let indexthreadlink = individualThreadList.indexOf(InstaUser);
          if (indexthreadlink !== -1) {
            individualThreadList.splice(indexthreadlink, 1);
            let NewListIdArray=JSON.stringify(individualThreadList);
            localStorage.setItem('ListIdArray', NewListIdArray);
          }else{
            let NewListIdArray=JSON.stringify(individualThreadList);
            localStorage.setItem('ListIdArray', NewListIdArray);
          }
        
         
          chrome.tabs.remove(sender.tab.id);
          localStorage.removeItem('instaIndividualMessage');
          localStorage.setItem('CheckMessageNReply',0);
          checkIndividualMessage();
        }else{
                  let ResponseMessagevalArray=[];
                  let ResponseMessage="";
                  await keyObj.map(function(eachval){
                    let keywordToFind =eachval.keyword.toLowerCase();
                        keywordToFind = " "+keywordToFind+" ";
                        if (Message.indexOf(keywordToFind)!=-1)
                        {
                          //console.log("KEEEEEEEEEEEEE",keywordToFind);
                              let PointIndex=Message.indexOf(keywordToFind);
                              ResponseMessagevalArray[PointIndex] = eachval.message
                              
                        }
                  });
                  if(ResponseMessagevalArray.length === 0){
                    console.log("Restart The Process ==========>")
                    //Check For Default Message and Respond Accordingly 
                    let Nowtime=$.now();
                   
                    let params  =   {
                    user_id:localStorage.getItem('user_id'),
                    kyubi_user_token:localStorage.getItem('kyubi_user_token'),
                    instagram_user_id:InstaUser,
                    instagram_username:InstaUserName,
                    instagram_profile_link:InstaUserLink,
                    instagram_image:InstaUserImage,
                    last_contact_incoming:Nowtime,
                    last_contact_outgoing:Nowtime,
                    last_default_message_time:Nowtime,
                    connection_type:1
                    }
                    let response = await handleRequest(
                      "/api/friend/getDefaultMessage",
                      method.POST,
                      toJsonStr(params)
                    ).then(async respon=>{
                      let responsenewvalue = await respon.json();
                        if(responsenewvalue.code == 1){
                          if(responsenewvalue.payload.Type == 0){
                            if(responsenewvalue.payload.SendMessage == 1){
                              let param ={
                                InstaUserName:InstaUserName,
                                MessageType:1,
                                InstaUser:InstaUser,
                                InstaUserImage:InstaUserImage,
                                InstaUserLink:InstaUserLink,
                                ReplyMessage:responsenewvalue.payload.Message
                              }
                              // chrome.debugger.attach({ tabId: sender.tab.id }, "1.3", function () {
                              //   chrome.debugger.sendCommand(
                              //     { tabId: sender.tab.id },
                              //     "Page.bringToFront",function () {
                              //       console.log("Hello Profile Page Enabled +++++++")
                                    chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});
                              //       chrome.debugger.detach({ tabId: sender.tab.id });           
                              //     });
                              // })
                            }else{
                              console.log("Restart The Process ==========>");
                              let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
                              let indexthreadlink = individualThreadList.indexOf(InstaUser);
                              if (indexthreadlink !== -1) {
                              individualThreadList.splice(indexthreadlink, 1);
                              let NewListIdArray=JSON.stringify(individualThreadList);
                              localStorage.setItem('ListIdArray', NewListIdArray);
                              }else{
                              let NewListIdArray=JSON.stringify(individualThreadList);
                              localStorage.setItem('ListIdArray', NewListIdArray);
                              }

                              chrome.tabs.remove(sender.tab.id);
                              localStorage.removeItem('instaIndividualMessage');
                              localStorage.setItem('CheckMessageNReply',0);
                              checkIndividualMessage();
                            }
                          }else{
                            if(responsenewvalue.payload.SendMessage == 1){
                              let paramsGroup  =   {
                                                    default_message_group: responsenewvalue.payload.Message,
                                                      KeywordParams:{
                                                        ChangeUserName:InstaUserName,
                                                        ChangeDate:Nowtime
                                                      }
                                                    }
                              let responseNew = await handleRequest(
                                "/api/friend/getGroupMessageContents",
                                method.POST,
                                toJsonStr(paramsGroup)
                              ).then(async responVal=>{
                                let responseNewvalue = await responVal.json();
                                if(responsenewvalue.code == 1){
                                  let param ={
                                    InstaUserName:InstaUserName,
                                    MessageType:1,
                                    InstaUser:InstaUser,
                                    InstaUserImage:InstaUserImage,
                                    InstaUserLink:InstaUserLink,
                                    ReplyMessage:responseNewvalue.payload.message
                                  }
                                  // chrome.debugger.attach({ tabId: sender.tab.id }, "1.3", function () {
                                  //   chrome.debugger.sendCommand(
                                  //     { tabId: sender.tab.id },
                                  //     "Page.bringToFront",function () {
                                  //       console.log("Hello Profile Page Enabled +++++++")
                                        chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});
                                  //       chrome.debugger.detach({ tabId: sender.tab.id });           
                                  //     });
                                  // })
                                }else{
                                  console.log("Restart The Process ==========>");
                                  let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
                                  let indexthreadlink = individualThreadList.indexOf(InstaUser);
                                  if (indexthreadlink !== -1) {
                                  individualThreadList.splice(indexthreadlink, 1);
                                  let NewListIdArray=JSON.stringify(individualThreadList);
                                  localStorage.setItem('ListIdArray', NewListIdArray);
                                  }else{
                                  let NewListIdArray=JSON.stringify(individualThreadList);
                                  localStorage.setItem('ListIdArray', NewListIdArray);
                                  }

                                  chrome.tabs.remove(sender.tab.id);
                                  localStorage.removeItem('instaIndividualMessage');
                                  localStorage.setItem('CheckMessageNReply',0);
                                  checkIndividualMessage();
                                }
                              });
                            }else{
                              console.log("Restart The Process ==========>");
                              let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
                              let indexthreadlink = individualThreadList.indexOf(InstaUser);
                              if (indexthreadlink !== -1) {
                              individualThreadList.splice(indexthreadlink, 1);
                              let NewListIdArray=JSON.stringify(individualThreadList);
                              localStorage.setItem('ListIdArray', NewListIdArray);
                              }else{
                              let NewListIdArray=JSON.stringify(individualThreadList);
                              localStorage.setItem('ListIdArray', NewListIdArray);
                              }

                              chrome.tabs.remove(sender.tab.id);
                              localStorage.removeItem('instaIndividualMessage');
                              localStorage.setItem('CheckMessageNReply',0);
                              checkIndividualMessage();
                            }
                          }
                        }

                    });
                    
                    
                  }else{
                    let myArray = ResponseMessagevalArray;
                    let unique = myArray.filter((v, i, a) => a.indexOf(v) === i);
                    let a = new Date(NowTime);
                    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    let year = a.getFullYear();
                    let month = months[a.getMonth()];
                    let date = a.getDate();
                    let hour = a.getHours();
                    let min = a.getMinutes();
                    let sec = a.getSeconds();
                    let OnlyDate = date + ' ' + month + ' ' + year ;
                    console.log("ThisissssssssssssssXXXXXXXXXXXXXXX Messahe array",unique); 
                    let ResponseMessage ="";
                    for (let count = 0; count < unique.length; count++) {
                      BaseMessage = unique[count] ;
                      BaseMessage = BaseMessage.split('{first_name}').join(InstaUserName);
                      BaseMessage = BaseMessage.split('{last_name}').join(InstaUserName);
                      BaseMessage = BaseMessage.split('{user_name}').join(InstaUserName);
                      BaseMessage = BaseMessage.split('{date}').join(OnlyDate);
                      ResponseMessage = ResponseMessage +" "+BaseMessage;
                    }
                    console.log("SendMessage to Popup -------",ResponseMessage);
                    let param ={
                      InstaUserName:InstaUserName,
                      MessageType:0,
                      InstaUser:InstaUser,
                      InstaUserImage:InstaUserImage,
                      InstaUserLink:InstaUserLink,
                      ReplyMessage:ResponseMessage
                    }
                    // chrome.debugger.attach({ tabId: sender.tab.id }, "1.3", function () {
                    //   chrome.debugger.sendCommand(
                    //     { tabId: sender.tab.id },
                    //     "Page.bringToFront",function () {
                    //       console.log("Hello Profile Page Enabled +++++++")
                          chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});
                    //       chrome.debugger.detach({ tabId: sender.tab.id });           
                    //     });
                    // })
                    //chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});

                  }
          
        }
      }
    }else{
      console.log("Restart The Process ==========>")
        let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
        let indexthreadlink = individualThreadList.indexOf(InstaUser);
        if (indexthreadlink !== -1) {
          individualThreadList.splice(indexthreadlink, 1);
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }else{
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }
      
        chrome.tabs.remove(sender.tab.id);
        localStorage.removeItem('instaIndividualMessage');
        localStorage.setItem('CheckMessageNReply',0);
        checkIndividualMessage();
    }

  }
  if(request.type ==  "StoreAndClose"){
    console.log("I am Inside StoreAndClose =========>",request.options);
    localStorage.getItem('user_id');
    localStorage.getItem('kyubi_user_token');
    let Nowtime=$.now();
    let user_id=localStorage.getItem('user_id');
    let kyubi_user_token=localStorage.getItem('kyubi_user_token');
    let instagram_user_id=request.options.InstaUser;
    let instagram_username=request.options.InstaUserName;
    let instagram_profile_link=request.options.InstaUserLink;
    let instagram_image=request.options.InstaUserImage;
    let last_contact_incoming=Nowtime;
    let last_contact_outgoing=Nowtime;
    let last_message=request.options.ReplyMessage;
    let last_default_message_time=Nowtime;
    let connection_type=request.options.MessageType;
    let params  =   {
    user_id:user_id,
    kyubi_user_token:kyubi_user_token,
    instagram_user_id:instagram_user_id,
    instagram_username:instagram_username,
    instagram_profile_link:instagram_profile_link,
    instagram_image:instagram_image,
    last_contact_incoming:last_contact_incoming,
    last_contact_outgoing:last_contact_outgoing,
    last_message:last_message,
    last_default_message_time:last_default_message_time,
    connection_type:connection_type
    }
    let response = await handleRequest(
      "/api/friend/saveLastMessageOutForFriend",
      method.POST,
      toJsonStr(params)
    ).then(respon=>{
        console.log("This Is The Response",respon)
        let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
        let indexthreadlink = individualThreadList.indexOf(request.options.InstaUser);
        if (indexthreadlink !== -1) {
          individualThreadList.splice(indexthreadlink, 1);
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }else{
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }
      
        chrome.tabs.remove(sender.tab.id);
        localStorage.removeItem('instaIndividualMessage');
        localStorage.setItem('CheckMessageNReply',0);
        checkIndividualMessage();
      
    });

  }
})

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(msg) {
    if(msg.ConFlag   ==  "StoreMessageLinkInLocalStorage")
        {
          console.log('store here',msg.options);
          let InstauserListId=msg.options.trim();
          let ListId=localStorage.getItem('ListIdArray');
          if(localStorage.getItem('ListIdArray')){
            let ListIdArray=JSON.parse(ListId);
            if(ListIdArray.length  === 0){
                    ListIdArray[ListIdArray.length]= msg.options;
                    let NewListIdArray=JSON.stringify(ListIdArray);
                    localStorage.setItem('ListIdArray', NewListIdArray);
            }else{
                    let check = ListIdArray.includes(msg.options);
                    if(check){
  
                    }else{
                    ListIdArray[ListIdArray.length]=msg.options;
                    let NewListIdArray=JSON.stringify(ListIdArray);
                    localStorage.setItem('ListIdArray', NewListIdArray);
                    }
            }
          }else{
            let ListIdArray=[];
            ListIdArray[ListIdArray.length]= msg.options;
            let NewListIdArray=JSON.stringify(ListIdArray);
            localStorage.setItem('ListIdArray', NewListIdArray);
          }
          checkIndividualMessage();
        }
    if(msg.ConFlag  ==  "checker"){
      console.log("I Reccccccccccccccccc",msg)
    }
  })
})

function checkIndividualMessage(){
  console.log("inside checker");
  let ListURL=localStorage.getItem('ListIdArray');
  let CheckMessageNReply=localStorage.getItem('CheckMessageNReply');
  let insta_logged_id=localStorage.getItem('insta_logged_id');
  let inBackgroundFetching=localStorage.getItem('inBackgroundFetching');
  let default_message=localStorage.getItem('default_message');
  let autoresponder=localStorage.getItem('autoresponder');
  let instamunread=parseInt(localStorage.getItem('instamunread'));
  if(insta_logged_id == "true" && inBackgroundFetching== "false"){
    console.log("inside checker1");
    if(default_message !=0  ||  autoresponder!=0){
      console.log("inside checker2");
      if(CheckMessageNReply == 0){
        console.log("inside checker3");
        if(localStorage.getItem('ListIdArray')){
          let ListURLArray = JSON.parse(ListURL);
          //console.log("Trigger ===========77",ListURLArray);
          if(ListURLArray.length===0){
            localStorage.setItem('CheckMessageNReply',0);
          }else{
            let myMessageUrl  =   ListURLArray[0];   
                 
            if(instamunread){
               let windowHeight= parseInt(window.screen.height);
               let WindowWidth= parseInt(window.screen.width);
               console.log("The Height",windowHeight);
               console.log("The Width",WindowWidth);
              chrome.windows.create({
                url: 'https://www.instagram.com/direct/inbox/',
                 type: "panel",
                 top :windowHeight,
                 left:WindowWidth,
                 height:20,
                 width:20
                },function(tab) { 
                let instaIndividualMessage=tab.id;
                console.log("Prodipto Is sending to",instaIndividualMessage);
                //chrome.tab.sendMessage(instaIndividualMessage,{type: "HitMessageIndividual", options: myMessageUrl}); 
                localStorage.setItem('instaIndividualMessage', instaIndividualMessage);
            });
              // console.log("Prodipto Is sending this",myMessageUrl);
              //let instaIndividualMessage = parseInt(localStorage.getItem('instaIndividualMessage'));
              //console.log("Prodipto Is sending to Window",myMessageUrl);
              //chrome.tabs.sendMessage(instaIndividualMessage,{type: "HitMessageIndividual", options: myMessageUrl}); 
              localStorage.setItem('CheckMessageNReply',1);
            }
            
          }
        }

      }
    }
  }
}