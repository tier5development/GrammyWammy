console.log("Listing Message Reader");
$(document).ready(function(){

chrome.runtime.sendMessage({type: "Trigger", options: "MessageListing"});
chrome.runtime.sendMessage({type: "TriggerReaderParam", options: "MessageListing"});
chrome.runtime.onMessage.addListener(async function(request, sender) {
    console.log("Please Check the Request Hi ============",request);
    
    if(request.type =="StartTheMutation"){
        if(request.TriggerLayout == "CreateLayout"){
            console.log("Please Create The Layout ============");
            var div=document.createElement("div");
            var textDiv =document.createElement("div");
            var imgURL = chrome.extension.getURL('128X128.png');
            div.style.width= "100%";
            div.style.height= "100%";
            div.style.position= "absolute";
            div.style.zIndex = "10000";
            div.style.background= "rgba(235,239,242,0.85)";
            div.style.isplay= "flex";
            div.style.flexWrap= "wrap";
            div.style.alignContent= "center";
            div.style.justifyContent= "center";
            div.style.position = 'fixed';
            div.style.top = '0';
            div.style.left = '0';
            var img = document.createElement("IMG");
            img.src = imgURL;
            img.style.position= "fixed";
            img.style.top= "50%";
            img.style.left= "50%";
            img.style.transform= "translate(-50%, -50%)";
            textDiv.innerHTML="GrammyWammy Is Using This Tab Please Don`t Close It";
            textDiv.style.top= "70%";
            textDiv.style.left= "27%";
            textDiv.style.position = 'fixed';
            textDiv.style.width= "100%";
            textDiv.style.fontSize="41px";
            textDiv.style.color= "#057ed9";
            div.appendChild(img);
            div.appendChild(textDiv);
            document.body.appendChild(div);
        }
        if(request.TriggerMutation == "StartTheMutation"){
            console.log("Please Start The Mutation ============");
                
                setInterval(function(){
                    
                    $(".N9abW").find(' > div:nth-child('+1+')').find(" > div").each(async function(){
                        let NewHtml=$(this).html();
                       // console.log("Inside Each Data -----------",NewHtml);
                        let CountChildrenDiv=$(this).find('a').find("> div").children('div').length;
                        let ChildrenURL=$(this).find('a').attr("href");
                        
                        if(CountChildrenDiv === 3){
                            let messageId =  ChildrenURL.replace('/direct/t/',"");
                            console.log("I will Send This Link XXXXXXXXXXXXXXXXXX--------------------",ChildrenURL);
                            let port = chrome.runtime.connect({name: "ListKnock"});
                            port.postMessage({options: messageId,ConFlag:"StoreUrlInStoreAndRetriveDate"});
                            port.disconnect();
                        }

                    })
                },3000)
                

        }
    }
    if(request.type =="StartTheSelection"){
        console.log("Please Select the following Message",request.MessageId);
        let SendMessageId =request.MessageId.trim();
        let WindowURL=window.location.search;
        let LocationDetails =window.location;
        console.log("This is Window URL========",WindowURL.pathname)
       
        console.log("This is Window Location Details URL=======",LocationDetails)
        let Windowpath=LocationDetails.pathname.replace('/direct/t/',"");
        if(Windowpath==SendMessageId){
            await grabMessageInfoAndSend(SendMessageId);  
        }
        setTimeout(async function() {
            let CheckHtml=$("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div').find(' > div:nth-child('+1+')').find(' > div:nth-child('+1+')').html();
            //console.log("Now I am Getting this Html",CheckHtml);
            await $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div').find(' > div:nth-child('+1+')').find(' > div:nth-child('+1+')').each( async function() {
                await $(this).find('> div').each( async function(key,laa) {
                    let messagelinkId= $(laa).find('a').attr('href');
                    let anchor = $(laa).find('a');
                    if(messagelinkId){
                        let messageId =  messagelinkId.replace('/direct/t/',"");
                        messageId=messageId.trim();
                        
                        console.log("Please hit the link---------------",messageId,"------",request.options);
                        if(messageId == SendMessageId){
                            
                           anchor[0].click();
                            

                        }
                        
                    }
                    
                }) 
            })
            await grabMessageInfoAndSend(request.MessageId);
            }, 3000);
    }
    if(request.type =="ReplyInstaUser"){
        $(`textarea`).focus();
        const blob = new Blob([request.options.ReplyMessage], { type: 'text/plain' });
        let cpData = [new ClipboardItem({ 'text/plain': blob })];
        await navigator.clipboard.write(cpData).then(
            function() {
                $(`textarea`).focus();
                console.log('came here');
                document.execCommand("paste");
                $('button:contains("Send")').trigger('click');
            })
            // let port = chrome.runtime.connect({name: "ListKnock"});
            // port.postMessage({options: request.options,ConFlag:"StoreAndClose"});
            // port.disconnect();
        chrome.runtime.sendMessage({type: "StoreAndClose", options: request.options});   
    }
});



            
            

});

async function grabMessageInfoAndSend(MessageId){
    await setTimeout(async function() {
    console.log("Please Grab the Last Message",MessageId);
    //let CheckHtml=$("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(2)').find(' > div:nth-child(2)').find(' > div:nth-child(1)').find('>div').find('>div').html();
    let UserName="";
    let UserLink="";
    let UserImages="";
    let TotalMessageCount=0;
    let Thread = new Array();
    

    $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(2)').find(' > div:nth-child(2)').find(' > div:nth-child(1)').find('>div').find('>div').find('>div').each(async function(countx ,valx) {
        if(countx === 0){
           $(this).find('> div').each(async function(county ,valy) {
                let mc =$(valy).find(' > div:nth-child(2)').find(' > div').find('> div').find('> div').find('> div').find('> div').find('> div').find('> div').find('> div').find('span').html();
                if($(valy).find(' > div:nth-child(2)').find(' > div').find('.VdURK ').length === 1){
                    if(mc !=null){
                        console.log("Outgoing",mc);
                        Thread.push([1,mc]);
                    }    
                }else{
                    if(mc !=null){
                    console.log("Incoming",mc);
                    Thread.push([2,mc]);
                    }
                }
                if($(valy).find(' > div').find(' > div:nth-child(1)').length !==1){
                    let acount=$(valy).find(' > div').find(' > div:nth-child(1)').find("a").length;
                    console.log("This is ithe value sir",acount);
                    if($(valy).find(' > div').find(' > div:nth-child(1)').find("a").length === 1){
                        UserLink= $(valy).find(' > div').find(' > div:nth-child(1)').find("a").attr("href");
                        UserImages= $(valy).find(' > div').find(' > div:nth-child(1)').find("a").find("img").attr("src");
                        UserName =  UserLink.split("/").pop();
                        UserName=UserName.trim();
                    }
                    TotalMessageCount=county;
                    //console.log("This are the User Info ======================",UserInfo);
                }
            })

        }
        
    })
    let responseMessageDetails={
        UserName:UserName,
        UserLink:UserLink,
        UserImages:UserImages,
        TotalMessageCount:TotalMessageCount,
        UseMessage:Thread,
        UserId:MessageId
        }
    console.log("Tis is the User Details",responseMessageDetails);
    chrome.runtime.sendMessage({type: "CheckMessageAndResponse", options: responseMessageDetails});
    },3000);
}