///console.log("I am in in Individual JS ",window.location.search);
let port = chrome.runtime.connect({name: "knockknock"});
let WindowURL=window.location.search;
var LocationDetails =window.location;
let newWindowURL=WindowURL.replace('?tid=cid.c.', ' ');
newWindowURL=newWindowURL.replace('?tid=cid.g.', ' ');
let reslinksplit = newWindowURL.split("&");
let FacebookIdString  = reslinksplit[0].split("%3A");
//console.log("This are Facebook User Details",FacebookIdString);
if($('#messageGroup').find('div').find('.e').length  > 0){
    let TotalChunks=$('#messageGroup').find('div').find('.e').length;
    let ProfileLink="";
    let content="";
            $('#messageGroup').find('div').find('.e').each( async function(ThisCountElem) {  
              if(ThisCountElem+1 === TotalChunks){
                let  HTMLX=$(this).last().html();
                ProfileLink=$(this).last().find('div').children('a').attr("href");
                let  Name=$(this).last().find('div').children('a').children('strong').html();
                ProfileName=Name.trim();          
                $(this).last().find('div').children('div').each(  async function(){
                  if($(this).children('span').html()){
                    content = content + " " + $(this).children('span').html();
                  }           
                })
                
              }
              
            }); 
            //console.log("This is the Content ========>",content);
            //console.log("This is the FaceBookUser ========>",ProfileName);
            let MessageDetails = {
                profile_name:ProfileName,
                message_content:content,
                facebook_Id:FacebookIdString,
                location_details:LocationDetails.href,
                ProfileLink:ProfileLink
            }
            port.postMessage({MessageDetails: MessageDetails,ConFlag:"CheckMessageContent"});
    //console.log("Total Chunk Is -------",TotalChunks);
}else{
    //console.log("Remove The Child from Array");
}

port.onMessage.addListener(async function(msg) {
  if (msg.ConFlagBack == "DEFAULTMESSAGEBACK"){
    $('#composerInput').val(msg.userInfoDetails);
    $( "#composer_form" ).submit();
    //console.log("RESPONSE To USER With Default Message",msg.userInfoDetails);
    let Nowtime=$.now();
        
        let setDefaultMessageSaveONEX={
          FacebookFirstName: msg.ThreadParams.FacebookFirstName,
          FacebookLastName: msg.ThreadParams.FacebookLastName,
          FacebookUserId: msg.ThreadParams.FacebookUserId,
          FriendFacebookId: msg.ThreadParams.FriendFacebookId,
          MfenevanId: msg.ThreadParams.MfenevanId,
          ProfileLink: msg.ThreadParams.ProfileLink,
          ResponseMessage: msg.userInfoDetails,
          ResponseTime:Nowtime,
          MessageSenderType:"last_default_message_time",
          LocationDetails:LocationDetails.href
          };
        //console.log("RESPONSE To Save  and Close With Link",setDefaultMessageSaveONEX);
        port.postMessage({MessageDetails: setDefaultMessageSaveONEX,ConFlag:"STOREANDCLOSE"});
  }
  if (msg.ConFlagBack == "AUTOMESSAGEBACK"){
    $('#composerInput').val(msg.userInfoDetails);
    $( "#composer_form" ).submit();
    //console.log("RESPONSE To USER With AutoResponder Message",msg.userInfoDetails);
    
    let Nowtime=$.now();
        let setDefaultMessageSaveONEX={
        FacebookFirstName: msg.ThreadParams.FacebookFirstName,
        FacebookLastName: msg.ThreadParams.FacebookLastName,
        FacebookUserId: msg.ThreadParams.FacebookUserId,
        FriendFacebookId: msg.ThreadParams.FriendFacebookId,
        MfenevanId: msg.ThreadParams.MfenevanId,
        ProfileLink: msg.ThreadParams.ProfileLink,
        ResponseMessage: msg.userInfoDetails,
        ResponseTime:Nowtime,
        MessageSenderType:"last_contact_outgoing",
        LocationDetails:LocationDetails.href
        };
        //console.log("RESPONSE To Save  and Close With Link",msg);
        port.postMessage({MessageDetails: setDefaultMessageSaveONEX,ConFlag:"STOREANDCLOSE"});
  }
})