const getApiUrl = "http://localhost:8008"; //"https://api.grammywammy.com" ;
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

/** 
 * @onMessage
 * this function will Listen To The SendMessage 
 * 
*/
chrome.runtime.onMessage.addListener(async function(request, sender) {
  //This Condition Will Trigger The Overlay In Profile and Trigger the Js To Grab Ifo From the INstagram Page
  if (request.type == "TrigerTheDeburger" && sender.tab.id ==parseInt(localStorage.getItem('instaprofile'))){
    chrome.tabs.sendMessage(sender.tab.id,{type: "StartTheProfileGrabing", TriggerLayout: "CreateLayout",TriggerScrapping:"GetInfoProfile"});
  }
  //This Condition Will Grab User Info and Store the user Info In Database and in local Storage And Create the Load The Message Listing Page In A Pinned tab Then It will Close the Profile tab
  if (request.type == "storeUserInfoOrQueryThenStore"){
    console.log("This I Got In Background",request.options);
    let userName = request.options.UserInstaGramUsername;
    let regex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/);
    let validation = regex.test(userName);
    if(validation) {
      $.get("https://www.instagram.com/"+userName+"/?__a=1")
      .done(function(data) {
          let  params ={
          kyubi_user_token    :   localStorage.getItem('kyubi_user_token'),
          instagram_id       :   data["graphql"]["user"]["id"],
          instagram_profile_name :   request.options.UserInstaGramUsername,
          instagram_name     :   request.options.UserInstaGramName,
          UserInstaGramImage    :  request.options.UserInstaGramImage
          };
          console.log("This are the data we Have to send",params);
          handleRequest(
          "/api/user/userinstagram",
          method.POST,
          toJsonStr(params)
          ).then(async response =>  {
            let responsenewvalue = await response.json();
                        let  ListIdArray=[];
                        let NewListIdArray=JSON.stringify(ListIdArray);
                        localStorage.setItem('CheckMessageNReply', 0);
                        localStorage.setItem('ListIdArray', NewListIdArray);
                        localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                        localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                        localStorage.setItem('insta_id', responsenewvalue.payload.UserInfo.instagram_id);
                        localStorage.setItem('insta_username', responsenewvalue.payload.UserInfo.instagram_profile_name);
                        localStorage.setItem('insta_name', responsenewvalue.payload.UserInfo.instagram_name);
                        localStorage.setItem('insta_image', responsenewvalue.payload.UserInfo.instagram_image);
                        localStorage.setItem('insta_logged_id', request.options.UserLoggedInInstaGram);
                        localStorage.setItem('inBackgroundFetching', false);
                        
                        UserLoggedInFacebook=request.options.UserLoggedInInstaGram;
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
                        if( AutoResponderStatus=== 1 && DefaultMessageStatus=== 1 && UserLoggedInFacebook=== true && BackGroundFetchingStatus===  false){
                          if(localStorage.getItem('InstagramMessageList')){
                            let InstagramMessageList=parseInt(localStorage.getItem('InstagramMessageList'));
                            chrome.tabs.remove(InstagramMessageList, function() { 
                            });
                            localStorage.removeItem('InstagramMessageList');
                          }
                          if(localStorage.getItem('instaprofile')){
                            let instaprofile=parseInt(localStorage.getItem('instaprofile'));
                            chrome.tabs.remove(instaprofile, function() { 
                            });
                            localStorage.removeItem('instaprofile');
                          }
                          const myNewUrl  =   `https://www.instagram.com/direct/inbox/`;
                          let CreateInstagramMessageListTab    =   chrome.tabs.create({
                            url: `https://www.instagram.com/direct/inbox/`,
                            active: true,
                            pinned:true
                          },function(tab) { 
                            let InstagramMessageList=tab.id;
                            localStorage.setItem('InstagramMessageList', InstagramMessageList);
                          });
                        }else{
                          if(localStorage.getItem('instaprofile')){
                            let instaprofile=parseInt(localStorage.getItem('instaprofile'));
                            chrome.tabs.remove(instaprofile, function() { 
                            });
                            localStorage.removeItem('instaprofile');
                          }
                        } 
                    
          }).catch(error=>{
            if(localStorage.getItem('instaprofile')){
              let instaprofile=parseInt(localStorage.getItem('instaprofile'));
              chrome.tabs.remove(instaprofile, function() { 
              });
              localStorage.removeItem('instaprofile');
            }
          } )

      })
      .fail(function() { 
          //code for 404 error 
          if(localStorage.getItem('instaprofile')){
            let instaprofile=parseInt(localStorage.getItem('instaprofile'));
            chrome.tabs.remove(instaprofile, function() { 
            });
            localStorage.removeItem('instaprofile');
          }
      })
    
    } else {
      if(localStorage.getItem('instaprofile')){
        let instaprofile=parseInt(localStorage.getItem('instaprofile'));
        chrome.tabs.remove(instaprofile, function() { 
        });
        localStorage.removeItem('instaprofile');
      }
    }
  } 
  //This Condition Will Trigger The Overlay In Message Listing Page and Trigger the Random Fetch of data from Listing
  if (request.type == "Trigger" && sender.tab.id ==parseInt(localStorage.getItem('InstagramMessageList'))){
    let InstagramMessageList=parseInt(localStorage.getItem('InstagramMessageList'));
    chrome.tabs.sendMessage(InstagramMessageList,{type: "StartTheMutation", TriggerLayout: "CreateLayout",TriggerMutation:"StartTheMutation"}); 
  }
  //This Condition Will Check the Message Content and Send the Replie back
  if (request.type == "CheckMessageAndResponse"){
    console.log("Please Check The message to which you want to changes",request);
    if(request.options.UseMessage.length != 0){
      let TotalMessageValuesCount=request.options.UseMessage.length - 1;
      if(request.options.UseMessage[TotalMessageValuesCount][0]===2){
        let InstaUserName=request.options.UserLink.split('/').join("");
        InstaUserName=InstaUserName.split('/').join("");
        let MessageType=0;
        let InstaUser=request.options.UserId;
        let InstaUserImage=request.options.UserImages;
        let InstaUserLink=request.options.UserLink;
        let Message = "";
        let CountrNum =0;
        let ResponseTextArray=[];
        for (var i = TotalMessageValuesCount; i >= 0; i--) {
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
                  
                }else{
                  ResponseTextArray[CountrNum] =IncomingMessage;
                  Message = Message + " " + IncomingMessage;
                  CountrNum++;
                  
                }
              }
            }else{
              break;
            }
        }
        console.log("This is the Message",Message);
        let AutoResponderKeyword=localStorage.getItem('keywordsTally');
        let keyObj = JSON.parse(AutoResponderKeyword);
        let NowTime=new Date().getTime(); 
        let totalkeyObj =keyObj.length;
        if(totalkeyObj != 0){
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
          console.log("We Need to send this Message===230",ResponseMessagevalArray)
          if(ResponseMessagevalArray.length !== 0){
            let myArray = ResponseMessagevalArray;
            let unique = myArray.filter((v, i, a) => a.indexOf(v) === i);
            console.log("We Need to send this Message===236",unique)
            let a = new Date(NowTime);
            let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let year = a.getFullYear();
            let month = months[a.getMonth()];
            let date = a.getDate();
            let OnlyDate = date + ' ' + month + ' ' + year ;
            let ResponseMessage ="";
            for (let count = 0; count < unique.length; count++) {
              BaseMessage = unique[count] ;
              BaseMessage = BaseMessage.split('{user_name}').join(InstaUserName);
              BaseMessage = BaseMessage.split('{date}').join(OnlyDate);
              ResponseMessage = ResponseMessage +" "+BaseMessage;
            }
            let param ={
              InstaUserName:InstaUserName,
              MessageType:0,
              InstaUser:InstaUser,
              InstaUserImage:InstaUserImage,
              InstaUserLink:InstaUserLink,
              ReplyMessage:ResponseMessage
            }
            console.log("This are the param258",param);
            chrome.windows.update(sender.tab.windowId ,{ focused: true});
            chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});  
          }else{
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
                            chrome.windows.update(sender.tab.windowId ,{ focused: true});
                            chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});  
                            //Send GroupId to Backend TO Get Default message and send it to Individual Messaging Page 
                          }else{
                           await RemoveInstaIdFromListid(InstaUser);
                            //Remove Message Id  From List and then SendMessageInfoOrReset
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
                                  chrome.windows.update(sender.tab.windowId ,{ focused: true});
                                  chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param}); 
                                }else{
                                  await RemoveInstaIdFromListid(InstaUser);
                                  //Remove Message Id  From List and then SendMessageInfoOrReset
                                }
                              }).catch( async error=>{
                                await RemoveInstaIdFromListid(InstaUser);
                                //Remove Message Id  From List and then SendMessageInfoOrReset
                              })
                            //Send GroupId to Backend TO Get Default message and send it to Individual Messaging Page 
                          }else{
                            await RemoveInstaIdFromListid(InstaUser);
                            //Remove Message Id  From List and then SendMessageInfoOrReset
                          } 
                        }
                      }else{
                        await RemoveInstaIdFromListid(InstaUser);
                        //Remove Message Id  From List and then SendMessageInfoOrReset
                      }
            }).catch( async error=>{
              await RemoveInstaIdFromListid(InstaUser);
              //Remove Message Id  From List and then SendMessageInfoOrReset
            })
              //Check For Default Message
          }

        }else{
          await RemoveInstaIdFromListid(InstaUser);
          //Remove Message Id  From List and then SendMessageInfoOrReset
        }
      }else{
        await RemoveInstaIdFromListid(request.options.UserId);
        //Remove Message Id  From List and then SendMessageInfoOrReset
      }
    }else{
      await RemoveInstaIdFromListid(request.options.UserId);
      //Remove Message Id  From List and then SendMessageInfoOrReset
    }
  }
  //This Condition Will Store Data In DataBAse and then clearout Remove Message Id  From List and then SendMessageInfoOrReset
  if (request.type == "StoreAndClose"){
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
      console.log("Remove Message Id  From List and then SendMessageInfoOrReset357",request.options.InstaUser);
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
      SendMessageInfoOrReset();
      //Remove Message Id  From List and then SendMessageInfoOrReset
    }).catch(error=>{
      console.log("Remove Message Id  From List and then SendMessageInfoOrReset371",request.options.InstaUser);
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
      SendMessageInfoOrReset();
      //Remove Message Id  From List and then SendMessageInfoOrReset
    });
  }
})

/** 
 * @onConnect
 * this function will Listen To The PORT msg
 * 
*/
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(msg) {
    if(msg.ConFlag  ==  "StoreUrlInStoreAndRetriveDate"){
        if(localStorage.getItem('ListIdArray')){
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
        }else{
          let ListIdArray= [];
          ListIdArray[0]= msg.options;
          let NewListIdArray=JSON.stringify(ListIdArray);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }         
    }
  })
})

/** 
 * @setInterval
 * this will check the ListIdArray For New Incoming Message after each 3 second
 * 
*/
setInterval(async function(){
  let windowHeight= parseInt(window.screen.height)+20;
  let WindowWidth= parseInt(window.screen.width)+20;
  let ListId=localStorage.getItem('ListIdArray');
  let CheckMessageNReply=localStorage.getItem('CheckMessageNReply');
  let insta_logged_id=localStorage.getItem('insta_logged_id');
  let default_message=localStorage.getItem('default_message');
  let autoresponder=localStorage.getItem('autoresponder');
  if(insta_logged_id === "true"){
    if(default_message !=0  ||  autoresponder!=0){
      if(localStorage.getItem('CheckMessageNReply')){
        if(CheckMessageNReply == 0){
          let ListIdArray = JSON.parse(ListId);
          if(ListIdArray.length>0){
            if(localStorage.getItem('InstagramMessageIndividual')){
              let newtab=parseInt(localStorage.getItem('InstagramMessageIndividual'));
              await chrome.tabs.get(newtab, async function(tab) {
                if (!tab) {
                  await chrome.windows.create({
                      url: `https://www.instagram.com/direct/inbox/`,
                      type: "panel",
                      top:windowHeight,
                      left:WindowWidth,
                      height:1,
                      width:1,
                      focused: true
                  },function(tab) { 
                      let InstagramMessageIndividual=tab.tabs[0].id;
                      localStorage.setItem('InstagramMessageIndividual', InstagramMessageIndividual);
                  });
                  console.log("Send Data toOpen Message229");
                  localStorage.setItem('CheckMessageNReply',1);
                  //Send Data toOpen Message
                  await SendMessageInfoOrReset();
                }else{
                  console.log("Send Data toOpen Message233");
                  localStorage.setItem('CheckMessageNReply',1);
                  //Send Data toOpen Message
                  await SendMessageInfoOrReset();
                }
              })
            }else{
              await chrome.windows.create({
                  url: `https://www.instagram.com/direct/inbox/`,
                  type: "panel",
                  top:windowHeight,
                  left:WindowWidth,
                  height:1,
                  width:1,
                  focused: true
              },function(tab) { 
                  let InstagramMessageIndividual=tab.tabs[0].id;
                  localStorage.setItem('InstagramMessageIndividual', InstagramMessageIndividual);
              });
              console.log("Send Data toOpen Message251");
              localStorage.setItem('CheckMessageNReply',1);
              //Send Data toOpen Message
              await SendMessageInfoOrReset();
            }
          }else{
            console.log("Do Nothing ListIdArray Length256");
            // Do Nothing
          }
        }else{
          console.log("Do Nothing CheckMessageNReply1 260");
          // Do Nothing
        }
      }else{
        console.log("Do Nothing CheckMessageNReply NONE 264");
        // Do Nothing
      }
    }else{
      console.log("Can Remove the Array From ListIdArray All Stat 0  268");
      //Can Remove the Array From ListIdArray
    }
  }else{
    console.log("Can Remove the Array From ListIdArray Not Logged In 276");
    //Can Remove the Array From ListIdArray
  }
},3000)

async function SendMessageInfoOrReset(){
  let ListId=localStorage.getItem('ListIdArray');
  let ListIdArray = JSON.parse(ListId);
  if(localStorage.getItem('InstagramMessageIndividual')){
    console.log("Send first if to MessageIndividual Window288",localStorage.getItem('InstagramMessageIndividual'));
    if(ListIdArray.length>0){
      let myMessageID  =   ListIdArray[0];
      let newtab=parseInt(localStorage.getItem('InstagramMessageIndividual'));
      chrome.tabs.get(newtab, async (tab) => {
        chrome.windows.update(tab.windowId ,{ focused: true});
      })
      chrome.tabs.sendMessage(newtab,{type: "StartTheSelection", MessageId:myMessageID});
    }else{
      let newtab=parseInt(localStorage.getItem('InstagramMessageIndividual'));
      chrome.tabs.get(newtab, function(tab) {
        if(tab.url=="https://www.instagram.com/direct/inbox/"){

        }else{
          chrome.tabs.update( tab.id, { 
            url: "https://www.instagram.com/direct/inbox/"});
          chrome.windows.update(tab.windowId ,{ focused: true});
        }
      })
      localStorage.setItem('CheckMessageNReply', 0);
      //Check MessageIndividual ID and update it with listingURL  then make CheckMessageNReply 0
    }
  }else{
    await setTimeout(async function() {
      console.log("Send first if to MessageIndividual Window301",localStorage.getItem('InstagramMessageIndividual'));
      if(ListIdArray.length>0){
        let myMessageID  =   ListIdArray[0];
        let newtab=parseInt(localStorage.getItem('InstagramMessageIndividual'));
        chrome.tabs.get(newtab, async (tab) => {
          chrome.windows.update(tab.windowId ,{ focused: true});
        })
        chrome.tabs.sendMessage(newtab,{type: "StartTheSelection", MessageId:myMessageID});
      }else{
        let newtab=parseInt(localStorage.getItem('InstagramMessageIndividual'));
        chrome.tabs.get(newtab, function(tab) {
          if(tab.url=="https://www.instagram.com/direct/inbox/"){

          }else{
            chrome.tabs.update( tab.id, { 
              url: "https://www.instagram.com/direct/inbox/"});
            chrome.windows.update(tab.windowId ,{ focused: true});
          }
        })
        localStorage.setItem('CheckMessageNReply', 0);
        //Check MessageIndividual ID and update it with listingURL  then make CheckMessageNReply 0
      }
    },2000);
  }
  
  

}

async function RemoveInstaIdFromListid(InstaUser){
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
      await SendMessageInfoOrReset();
}