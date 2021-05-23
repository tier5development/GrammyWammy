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
 * @onConnect
 * this function will Listen To The PORT msg
 * 
*/
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(msg) {
    
    if(msg.ConFlag  ==  "StoreUrlInStoreAndRetriveDate"){
      setTimeout(function(){
        if(localStorage.getItem('ListIdArray')){
          let ListId=localStorage.getItem('ListIdArray');
          let ListIdArray=JSON.parse(ListId);
          if(ListIdArray.length  === 0)
          {
              ListIdArray[ListIdArray.length]= msg.options;
              let NewListIdArray=JSON.stringify(ListIdArray);
              localStorage.setItem('ListIdArray', NewListIdArray);
              CheckOrCreateTab();
          }
          else
          {
              let check = ListIdArray.includes(msg.options);
              if(check){
                CheckOrCreateTab();
              }else{
              ListIdArray[ListIdArray.length]=msg.options;
              let NewListIdArray=JSON.stringify(ListIdArray);
              localStorage.setItem('ListIdArray', NewListIdArray);
              CheckOrCreateTab();
              }
         }
        }else{
          let ListIdArray= [];
          ListIdArray[0]= msg.options;
          let NewListIdArray=JSON.stringify(ListIdArray);
          localStorage.setItem('ListIdArray', NewListIdArray);
          CheckOrCreateTab();
        }
      },3500)
        
              
    }
  })
})
/** 
 * @onMessage
 * this function will Listen To The SendMessage 
 * 
*/
chrome.runtime.onMessage.addListener(async function(request, sender) {
  console.log("This is the Request 1111 =========>  dfdfghfdgfdgdfgdfgdfg",request);
  console.log("This is the Sender 111111=========>  dfdfghfdgfdgdfgdfgdfg",sender)
  let InstagramMessageList=parseInt(localStorage.getItem('InstagramMessageList'));
  console.log("This is the Sender Id1",sender.tab.id);
    console.log("This is the Local Id1",InstagramMessageList);
  if (request.type == "Trigger" && sender.tab.id ==InstagramMessageList){
    console.log("This is the Sender Id2",sender.tab.id);
    console.log("This is the Local Id2",InstagramMessageList);
    chrome.tabs.sendMessage(InstagramMessageList,{type: "StartTheMutation", TriggerLayout: "CreateLayout",TriggerMutation:"StartTheMutation"}); 
  }
  if(request.type == "TriggerReaderParam" && sender.tab.id ==parseInt(localStorage.getItem('InstagramMessageIndividual'))){
    SenDInfoToMessageTabToOpenIndividual(sender.tab.id);
  }
  if(request.type ==  "CheckMessageAndResponse"){
    console.log("Please Check The message to which you want to changes",request);
    console.log("Please Check The message count",request.options.UseMessage.length);
    console.log("Please Check The message to which you want to changes",request.options.TotalMessageCount);
    if(request.options.UseMessage.length != 0){

      let TotalMessageValuesCount=request.options.UseMessage.length - 1;
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
        ClearListTabIdAndCheckMessageNReply(sender.tab.id,request.options.UserId);
        console.log("Remove the UserId From Message Listnad Change the Value of CheckMessageNReply to 0 the call CheckOrCreateTab and SenDInfoToMessageTabToOpenIndividual151");
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
        let conttex=request.options.UseMessage.length-1;

        if(ResponseMessagevalArray.length === 0 && request.options.UseMessage[conttex][0]===2){
                    console.log("Hit The Default Message Process ==========>");
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
                            console.log("This are the param198",param);
                            chrome.windows.update(sender.tab.windowId ,{ focused: true});
                            chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});
                          }else{
                            ClearListTabIdAndCheckMessageNReply(sender.tab.id,request.options.UserId);
                            console.log("Remove the UserId From Message Listnad Change the Value of CheckMessageNReply to 0 the call CheckOrCreateTab and SenDInfoToMessageTabToOpenIndividual201");

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
                            console.log("This are the param214",paramsGroup);
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
                                      console.log("This are the param230",param);
                                      chrome.windows.update(sender.tab.windowId ,{ focused: true});
                                      chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});                                
                              }else{
                                ClearListTabIdAndCheckMessageNReply(sender.tab.id,request.options.UserId);
                                console.log("Remove the UserId From Message Listnad Change the Value of CheckMessageNReply to 0 the call CheckOrCreateTab and SenDInfoToMessageTabToOpenIndividual234");

                              }
                            });
                            //chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});
                          }else{
                            ClearListTabIdAndCheckMessageNReply(sender.tab.id,request.options.UserId);
                            console.log("Remove the UserId From Message Listnad Change the Value of CheckMessageNReply to 0 the call CheckOrCreateTab and SenDInfoToMessageTabToOpenIndividual216");
                          }
                        }
                      }else{
                        ClearListTabIdAndCheckMessageNReply(sender.tab.id,request.options.UserId);
                        console.log("Remove the UserId From Message Listnad Change the Value of CheckMessageNReply to 0 the call CheckOrCreateTab and SenDInfoToMessageTabToOpenIndividual220");
                      }
                    });
        }else{
          console.log("Hit The Message Process ==========>");
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
                    console.log("This are the param278",param);
                    chrome.windows.update(sender.tab.windowId ,{ focused: true});
                    chrome.tabs.sendMessage(sender.tab.id,{type: "ReplyInstaUser", options: param});    
                      
        }
      }
    }else{
      ClearListTabIdAndCheckMessageNReply(sender.tab.id,request.options.UserId);
      console.log("Remove the UserId From Message Listnad Change the Value of CheckMessageNReply to 0 the call CheckOrCreateTab and SenDInfoToMessageTabToOpenIndividual229");
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
      console.log("Remove the UserId From Message Listnad Change the Value of CheckMessageNReply to 0 the call CheckOrCreateTab and SenDInfoToMessageTabToOpenIndividual201");
      ClearListTabIdAndCheckMessageNReply(sender.tab.id,instagram_user_id);
    });
  }
})

/** 
 * @CheckOrCreateTab
 * Check Wether The Tab Is there Or Create and Store TabID As InstagramMessageIndividual
 * 
*/
async function CheckOrCreateTab(){
  console.log("-------iii-------");
  let windowHeight= parseInt(window.screen.height)-100;
  let WindowWidth= parseInt(window.screen.width)-100;
  if(localStorage.getItem('InstagramMessageIndividual')){
    let newtab=parseInt(localStorage.getItem('InstagramMessageIndividual'));
    chrome.tabs.get(newtab, function(tab) {
        if (!tab) {
          let CreateInstagramMessageIndividualTab    =   chrome.windows.create({
              url: `https://www.instagram.com/direct/inbox/`,
              type: "panel",
              
              height:200,
              width:200
          },function(tab) { 
          //let Tab = JSON.parse(tab.tabs);
          //console.log("Crrrrrrr",tab.tabs[0]);
              let InstagramMessageIndividual=tab.tabs[0].id;
              localStorage.setItem('InstagramMessageIndividual', InstagramMessageIndividual);
          });
        }else{
          console.log("-------ChangeVal-------",newtab);
          SenDInfoToMessageTabToOpenIndividual(newtab);
        }
    })
  }else{
    let CreateInstagramMessageIndividualTab    =   chrome.windows.create({
        url: `https://www.instagram.com/direct/inbox/`,
        type: "panel",
        
        height:200,
        width:200
    },function(tab) { 
      //let Tab = JSON.parse(tab.tabs);
      //console.log("Crrrrrrr",tab.tabs[0].id);
        let InstagramMessageIndividual=tab.tabs[0].id;
        localStorage.setItem('InstagramMessageIndividual', InstagramMessageIndividual);
    });
  }
}
function ClearListTabIdAndCheckMessageNReply(tabId,InstaUserId){
        let individualThreadList  = JSON.parse(localStorage.getItem('ListIdArray'));
        let indexthreadlink = individualThreadList.indexOf(InstaUserId);
        if (indexthreadlink !== -1) {
          individualThreadList.splice(indexthreadlink, 1);
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }else{
          let NewListIdArray=JSON.stringify(individualThreadList);
          localStorage.setItem('ListIdArray', NewListIdArray);
        }
        localStorage.setItem('CheckMessageNReply',0);
        SenDInfoToMessageTabToOpenIndividual(tabId);
}
function SenDInfoToMessageTabToOpenIndividual(tabId){
 console.log("Please hi the select ID now ??????????",tabId);
        let ListId=localStorage.getItem('ListIdArray');
        let CheckMessageNReply=localStorage.getItem('CheckMessageNReply');
        let insta_logged_id=localStorage.getItem('insta_logged_id');
        let default_message=localStorage.getItem('default_message');
        let autoresponder=localStorage.getItem('autoresponder');
        if(default_message !=0  ||  autoresponder!=0){
          console.log("I am In 1");
          if(localStorage.getItem('CheckMessageNReply')){
            console.log("I am In 2");
            if(CheckMessageNReply == 0){
              //Process
              console.log("I am In 22");
              let ListIdArray = JSON.parse(ListId);
              if(ListIdArray.length>0){
                console.log("I am In 022");
                  //Process
                  let myMessageID  =   ListIdArray[0];
                  console.log("Sending Thissssssssssssssssss",myMessageID," To thisssssssssssTab",myMessageID )
                  chrome.tabs.sendMessage(tabId,{type: "StartTheSelection", MessageId:myMessageID}); 
              }else{
                console.log("I am In 0202");
                //Close The MessageIndividualTab
              }
            }else{
              console.log("I am In 202");
              //Do Nothing
            }
          }else{
            console.log("I am In 02");
              let ListIdArray = JSON.parse(ListId);
              if(ListIdArray.length>0){
                console.log("I am In 022");
                  //Process
                  let myMessageID  =   ListIdArray[0];
                  console.log("Sending Thissssssssssssssssss",myMessageID," To thisssssssssssTab",myMessageID )
                  chrome.tabs.sendMessage(tabId,{type: "StartTheSelection", MessageId:myMessageID}); 
              }else{
                console.log("I am In 0202");
                //Close The MessageIndividualTab
              }
          }
        }else{
          console.log("I am In 01");
          //Close The MessageTab and MessageIndividualTab
        }
}

