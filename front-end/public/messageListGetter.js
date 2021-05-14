console.log("Instant Message Read");
$(document).ready(function(){
    chrome.runtime.sendMessage({type: "TrigerTheDeburger", options: "Listing"});
    chrome.runtime.onMessage.addListener(async function(request, sender) {
        console.log("Please Check the Request Hi ============",request);
        if(request.type =="StartTheMutation"){
            console.log("Inside Message Read");
            let target = document.querySelector('.N9abW');
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    console.log("Inside Mutation");
                    let messageLink = mutation.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("href");
                    if(messageLink)
                    {
                        let messageId =  messageLink.split("/").pop();
                        console.log("this is",messageId);
                        let port = chrome.runtime.connect({name: "knockknock"});
                        port.postMessage({options: messageId,ConFlag:"StoreMessageLinkInLocalStorage"});
                        port.disconnect(); 
                    }
                });
            });
            // configuration of the observer:
            let config = { attributes: true, childList: true, characterData: true, subtree:true }
            // pass in the target node, as well as the observer options
            observer.observe(target, config);
        }
        if(request.type =="StartTheRestGrabing"){
            console.log("Please select the Provided Link",request.options);
            setTimeout(function() {
            let CheckHtml=$("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div').find(' > div:nth-child('+1+')').find(' > div:nth-child('+1+')').html();
            //console.log("Now I am Getting this Html",CheckHtml);
            $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(1)').find(' > div:nth-child(2)').find(' > div').find(' > div').find(' > div:nth-child('+1+')').find(' > div:nth-child('+1+')').each( async function() {
                //console.log("Now I am Getting this Html",$(this).html());
                await $(this).find('> div').each( async function(key,laa) {
                    //console.log("This issss Keyyyy ========",key)
                    //console.log("This issss Vall =====",laa);
                    let messagelinkId= $(laa).find('a').attr('href');
                    let anchor = $(laa).find('a');
                    if(messagelinkId){
                        let messageId =  messagelinkId.split("/").pop();
                        messageId=messageId.trim();
                        console.log("Please hit the link---------------",messageId,"------",request.options);
                        if(messageId == request.options){
                            
                            chrome.runtime.sendMessage({type: "TrigerReader", options: messageId});
                            anchor[0].click();
                            

                        }
                        console.log("This is the HTML Link I Got",messageId);
                        console.log("This is the HTML data I Got",request);
                    }
                    
                }) 
            })
            }, 3000);
            
        }
        if(request.type =="GrabMessageAndDetails"){
            console.log("Please Grab the Last Message",request.options);
            //let CheckHtml=$("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(2)').find(' > div:nth-child(2)').find(' > div:nth-child(1)').find('>div').find('>div').html();
            let UserName="";
            let UserLink="";
            let UserImages="";
            let TotalMessageCount=0;
            let Thread = new Array();
            

            $("#react-root").find(' > section').find('> div').find(' > div:nth-child(2)').find('> div').find('> div').find(' > div:nth-child(2)').find(' > div:nth-child(2)').find(' > div:nth-child(1)').find('>div').find('>div').find('>div').each(async function(countx ,valx) {
                console.log("This Is The Count +++++++++++++++++",countx);
                if(countx === 0){
                   console.log("This is the total message count ---------------",$(this).find('> div').find(' > div').length)
                    $(this).find('> div').each(async function(county ,valy) {
                        console.log("Please Grab the  Message ==============XXXXXX========",$(valy).find(' > div:nth-child(2)').find(' > div').html());
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
                UserId:request.options
                }
            console.log("Tis is the User Details",responseMessageDetails);
            chrome.runtime.sendMessage({type: "CheckMessageAndResponse", options: responseMessageDetails});
        }
        if(request.type =="ReplyInstaUser"){
            console.log("This I am going to reply ============",request.options);
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
            chrome.runtime.sendMessage({type: "StoreAndClose", options: request.options});          
        }
    });

    chrome.runtime.sendMessage({type: "TrigerTheDeburgerIndividual", options: "Individual"});
    

});