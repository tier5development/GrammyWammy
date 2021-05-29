const   UsersRepo   =   require('../../../models/repositories/user.repository');
const   FriendsRepo =   require('../../../models/repositories/friends.repository');
const   UserSettingRepository   =   require('../../../models/repositories/settings.repository');
const   MessageGroup    =   require('../../../models/repositories/messagegroup.repository');
const   MessageSegment  =   require('../../../models/repositories/messagesegment.repository');
//var typecast = require('typecast');
const cast = require('TypeCast');
module.exports.FriendsCreateOrUpdate    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.user_id,req.body.instagram_id);
        console.log("PrevData",FriendsInfo);
        if(FriendsInfo){
            console.log("Have Friends");
            let FriendsInfoPayload= {
                last_contact_incoming:req.body.last_contact_incoming
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
        }else{
            console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.user_id,
                instagram_id: req.body.instagram_id,
                last_contact_incoming:req.body.last_contact_incoming
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            
        }
        res.send({
            code: 1,
            message: "Success",
            payload: req.body
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.FriendsUpdate    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.user_id,req.body.instagram_id);
        if(FriendsInfo){
            console.log("Have Friends");
            let FriendsInfoPayload= {
                last_contact_outgoing:req.body.last_contact_outgoing,
                instagram_username:req.body.instagram_username,
                instagram_name:req.body.instagram_name
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
        }else{
            console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.user_id,
                instagram_id: req.body.instagram_id,
                last_contact_outgoing:req.body.last_contact_outgoing,
                instagram_username:req.body.instagram_username,
                instagram_name:req.body.instagram_name
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            
        }
        res.send({
            code: 1,
            message: "Success",
            payload: req.body
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.CheckFriendReadyToReciveDefaultMessage   =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
       // let TimeNowTC=typecast(req.body.TimeNow, 'number')
        let TimeNowTC=cast.number(req.body.TimeNow)
        
        let a = new Date(TimeNowTC);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let OnlyDate = date + ' ' + month + ' ' + year ;
        let KeywordParams={
            ChangeDate:OnlyDate,
            ChangeFirstName:req.body.instagramFirstName,
            ChangeLastName:req.body.instagramLastName
        }
        let getUserSettings= await UserSettingRepository.GetUserSettingById(req.body.MfenevanId);
        let sendOption = 0;
        console.log('Having Get Settings'+ getUserSettings);
        if(getUserSettings){
            let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.MfenevanId,req.body.FriendinstagramId,req.body.instagramUserId);
            console.log('instagram Friends'+ FriendsInfo);
            if(FriendsInfo){
                
                  let FriendsInfoPayload= {
                    instagram_username:req.body.ProfileLink,
                    instagram_first_name:req.body.instagramFirstName,
                    instagram_last_name:req.body.instagramLastName
                  };
                let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
                if(FriendsInfo.last_default_message_time==0){
                    sendOption = 1;
                }else{
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now before  casting",req.body.TimeNow);
                    let TimeNow=cast.number(req.body.TimeNow)
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now after  casting",TimeNow);
                    let timediff=(TimeNow - FriendsInfo.last_default_message_time)/ (60*60*1000);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Difference",timediff);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Delay",getUserSettings.default_time_delay);
                    if(timediff>getUserSettings.default_time_delay){
                        console.log("Increaessssssssssssssss")
                        sendOption = 1; 
                    }else{
                        console.log("ZZZZZZZZZZZZZZZZZZZZZ")
                        sendOption = 0;
                    }
                }
            }else{
                let FriendsInfoPayload= {
                    user_id: req.body.MfenevanId,
                    instagram_id: req.body.FriendinstagramId,
                    instagram_user_id:req.body.instagramUserId,
                    instagram_username:req.body.ProfileLink,
                    instagram_first_name:req.body.instagramFirstName,
                    instagram_last_name:req.body.instagramLastName
                };
                console.log('instagram Info Payload '+FriendsInfoPayload);
                let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
                sendOption = 1;
            }
        }else{
            sendOption = 0;  
        }
        if(sendOption==1 && getUserSettings.default_message==1){
            if(getUserSettings.default_message_type==0){
                let newText=getUserSettings.default_message_text.replace('{first_name}'," "+KeywordParams.ChangeFirstName);
                newText=newText.replace('{last_name}'," "+KeywordParams.ChangeLastName);
                newText=newText.replace('{date}'," "+KeywordParams.ChangeDate);
                newText=newText.replace('{Date}'," "+KeywordParams.ChangeDate);
                res.status(200).send({
                    code: 1,
                    message: "Succefully fetched random message from the selected group",
                    payload: {
                    message: newText
                    }
                })
            }else{
                if(getUserSettings.default_message_group!=""){
                    await MessageGroup.GetMessageGroup(getUserSettings.default_message_group).then(async resultGroup=>{
                        let TotalNumberofBlocks=resultGroup.associate_blocks.length;
                        let CointNum=Math.floor(Math.random() * TotalNumberofBlocks);
                        let randomBlock = resultGroup.associate_blocks[CointNum];
                        if(randomBlock.length>0){
                            let i = 0
                            let finalMessage = []
                            sendResponse = (data) =>{
                            res.status(200).send({
                                code: 1,
                                message: "Succefully fetched random message from the selected group",
                                payload: {
                                message: data
                                }
                            })
                            }
                            constructMessage(i,randomBlock,finalMessage,sendResponse,KeywordParams);
                            
                        }else{
                            res.status(200).send({
                                code: 2,
                                message: "UnSuccefully fetched random message from the selected group",
                                payload: { }
                            }) 
                        }
                    });
                }else{
                    res.status(200).send({
                        code: 2,
                        message: "UnSuccefully fetched random message from the selected group",
                        payload: {}
                    }) 
                }
            }
        }else{
            console.log('Condition Satisfied');
            res.status(200).send({
                code: 2,
                message: "UnSuccefully fetched random message from the selected group",
                payload: {}
            }) 
        }
        
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.friendsDefaultMessageCheck   =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);

        let codex  =  2;
        let  mess =  "Dont Send";
        let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.MfenevanId,req.body.FriendinstagramId);
        if(FriendsInfo){
        //     console.log(req.body.last_contact_outgoing);
        //     console.log(FriendsInfo.last_default_message_time);
        //     console.log("Have Friends");
            let FriendsInfoPayload= {
                instagram_username:req.body.instagram_username,
                instagram_name:req.body.instagram_name
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
              if(FriendsInfo.last_default_message_time==0){
                codex=1;
                mess="send message";
              }else{
                timediff=(req.body.TimeNow - FriendsInfo.last_default_message_time)/ (60*60*1000);
                if(timediff>req.body.DefaultMessageTimeDelay){
                    codex=1;
                    mess="send message"; 
                }else{
                    codex=2;
                    mess="Dont Send";
                }
              }
        }else{
        //     console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.MfenevanId,
                instagram_id: req.body.FriendinstagramId,
                instagram_username:req.body.ProfileLink,
                instagram_name:req.body.ProfileName
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            if(saveFriendsInfo.last_default_message_time==0){
                codex=1;
                mess="send message";
              }
        }
        res.send({
            code: codex,
            message: "Success",
            payload: mess
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.friendsUpdateDefaut    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.user_id,req.body.instagram_id);
        if(FriendsInfo){
            console.log("Have Friends");
            let FriendsInfoPayload= {
                last_default_message_time:req.body.last_contact_outgoing,
                instagram_username:req.body.instagram_username,
                instagram_name:req.body.instagram_name
              };
              let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
        }else{
            console.log("No Friends");
            let FriendsInfoPayload= {
                user_id: req.body.user_id,
                instagram_id: req.body.instagram_id,
                last_default_message_time:req.body.last_contact_outgoing,
                instagram_username:req.body.instagram_username,
                instagram_name:req.body.instagram_name
              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            
        }
        res.send({
            code: 1,
            message: "Success",
            payload: req.body
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.SaveLastMessageOutForFriend  =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent From Instagram",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.instagram_user_id);
        let FriendsInfoPayload= {};
        let user_id= req.body.user_id;
        let kyubi_user_token= req.body.kyubi_user_token;
        let instagram_user_id= req.body.instagram_user_id;
        
        if(FriendsInfo){
            if(req.body.connection_type == 0){
                FriendsInfoPayload= {
                    instagram_username:req.body.instagram_username,
                    instagram_profile_link:req.body.instagram_profile_link,
                    instagram_image:req.body.instagram_image,
                    last_contact_incoming: req.body.last_contact_incoming,
                    last_contact_outgoing: req.body.last_contact_outgoing,
                    last_message:req.body.last_message,
                    connection_type:req.body.connection_type
                };
            }else{
                FriendsInfoPayload= {
                    instagram_username:req.body.instagram_username,
                    instagram_profile_link:req.body.instagram_profile_link,
                    instagram_image:req.body.instagram_image,
                    last_contact_incoming: req.body.last_contact_incoming,
                    last_contact_outgoing: req.body.last_contact_outgoing,
                    last_message:req.body.last_message,
                    last_default_message_time: req.body.last_contact_outgoing,
                    connection_type:req.body.connection_type
                };
            }
            let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
        }else{
            
            if(req.body.connection_type == 0){
                FriendsInfoPayload= {
                    user_id: user_id,
                    kyubi_user_token:kyubi_user_token,
                    instagram_user_id:instagram_user_id,
                    instagram_username:req.body.instagram_username,
                    instagram_profile_link:req.body.instagram_profile_link,
                    instagram_image:req.body.instagram_image,
                    last_contact_incoming: req.body.last_contact_incoming,
                    last_contact_outgoing: req.body.last_contact_outgoing,
                    last_message:req.body.last_message,
                    connection_type:req.body.connection_type
                };
            }else{
                FriendsInfoPayload= {
                    user_id: user_id,
                    kyubi_user_token:kyubi_user_token,
                    instagram_user_id:instagram_user_id,
                    instagram_username:req.body.instagram_username,
                    instagram_profile_link:req.body.instagram_profile_link,
                    instagram_image:req.body.instagram_image,
                    last_contact_incoming: req.body.last_contact_incoming,
                    last_contact_outgoing: req.body.last_contact_outgoing,
                    last_message:req.body.last_message,
                    last_default_message_time: req.body.last_contact_outgoing,
                    connection_type:req.body.connection_type
                };
            }
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
        }
        
        res.send({
            code: 1,
            message: "Successfull",
            payload: FriendsInfo
        })
        
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.friendsSaveLastMessageOut    =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.MfenevanId,req.body.FriendinstagramId);
        if(FriendsInfo){
            if(req.body.DefaultMessageLastTime == 0){
                let FriendsInfoPayload= {
                    
                    instagram_id: req.body.FriendinstagramId,
                    instagram_username:req.body.ProfileLink,
                    instagram_name:req.body.ProfileName,
                    last_contact_outgoing:req.body.LastContactOutGoing
                  };
                  let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
                  let NewFriendInfo=await FriendsRepo.GetUserByUserinstagramID(req.body.MfenevanId,req.body.FriendinstagramId);
                    if(updateFriendsInfo){
                        res.send({
                            code: 1,
                            message: "Friends Last Outginng Message Saved",
                            payload: NewFriendInfo
                        })
                    }else{
                        res.send({
                            code: 1,
                            message: "Friends Last Outginng Message Saved With Error",
                            payload: NewFriendInfo
                        })
                    }
                }else{
                let FriendsInfoPayload= {
                    
                    instagram_id: req.body.FriendinstagramId,
                    instagram_username:req.body.ProfileLink,
                    instagram_name:req.body.ProfileName,
                    last_contact_outgoing:req.body.LastContactOutGoing,
                    last_default_message_time:req.body.DefaultMessageLastTime
    
                  };
                  let updateFriendsInfo=await FriendsRepo.updateFriendsInfoById(FriendsInfoPayload,FriendsInfo._id);
                  let NewFriendInfo=await FriendsRepo.GetUserByUserinstagramID(req.body.MfenevanId,req.body.FriendinstagramId);
                  if(updateFriendsInfo){
                    res.send({
                        code: 1,
                        message: "Friends Last Outginng Message Saved",
                        payload: NewFriendInfo
                    })
                    }else{
                        res.send({
                            code: 1,
                            message: "Friends Last Outginng Message Saved With Error",
                            payload: NewFriendInfo
                        })
                    }
                }
            
            
            
        }else{
            let FriendsInfoPayload= {
                user_id: req.body.MfenevanId,
                instagram_id: req.body.FriendinstagramId,
                instagram_username:req.body.ProfileLink,
                instagram_name:req.body.ProfileName,
                last_contact_outgoing:req.body.LastContactOutGoing,
                last_default_message_time:req.body.DefaultMessageLastTime

              };
            let saveFriendsInfo=await FriendsRepo.CreateFriendsInfo(FriendsInfoPayload);
            if(saveFriendsInfo){
                res.send({
                    code: 1,
                    message: "Friends Last Outginng Message Saved",
                    payload: saveFriendsInfo
                })
            }else{
                res.send({
                    code: 1,
                    message: "Friends Last Outginng Message Saved With Error",
                    payload: saveFriendsInfo
                }) 
            }
        }

    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}

module.exports.fetchMessageGroupAndContents =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);

        await UserSettingRepository.GetUserSettingById(req.body.MfenevanId).then(async resultSettings=>{
            if(resultSettings.default_message_group!=""){
                console.log("This is my Setting Details",resultSettings);
                let RandomMessage="";
                await MessageGroup.GetMessageGroup(resultSettings.default_message_group).then(async resultGroup=>{
                    let TotalNumberofBlocks=resultGroup.associate_blocks.length;
                    let CointNum=Math.floor(Math.random() * TotalNumberofBlocks);
                    let randomBlock = resultGroup.associate_blocks[CointNum];
                    console.log("This is Random MessageGroup=====",randomBlock);
                    if(randomBlock.length>0){
                        let i = 0
                        let finalMessage = []
                        sendResponse = (data) =>{
                        res.status(200).send({
                            code: 1,
                            message: "Succefully fetched random message from the selected group",
                            payload: {
                            message: data
                            // data: randomSegment.segment_id.message_blocks[getRandomInt(0,randomSegment.segment_id.message_blocks.length -1)]
                            }
                        })
                        }
                        constructMessage(i,randomBlock,finalMessage,sendResponse);
                        
                    }
                });
                console.log("This is the final Message========================>",RandomMessage)
            }
        });
        
        

    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.GetDefaultMessage = async (req,  res)    => {
    try{
        console.log("This is my sent",req.body);
        let FriendsInfo = await FriendsRepo.GetUserByUserinstagramID(req.body.instagram_user_id);
        let getUserSettings= await UserSettingRepository.GetUserSettingById(req.body.user_id);
        console.log("This isUser Details",getUserSettings);
        console.log("This isFriend Details",FriendsInfo);
        let Message="";
        let Type=0;
        let SendMessage=0;
            let a = new Date(req.body.last_contact_outgoing);
            let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let year = a.getFullYear();
            let month = months[a.getMonth()];
            let date = a.getDate();
            let hour = a.getHours();
            let min = a.getMinutes();
            let sec = a.getSeconds();
            let OnlyDate = date + ' ' + month + ' ' + year ;
        if(getUserSettings.default_message_type == 0){
            if(FriendsInfo.last_default_message_time == 0){
                Message=getUserSettings.default_message_text;
                Message=Message.replace('{first_name}'," "+req.body.instagram_username);
                Message=Message.replace('{last_name}'," "+req.body.instagram_username);
                Message=Message.replace('{user_name}'," "+req.body.instagram_username);
                Message=Message.replace('{date}'," "+OnlyDate);
                Message=Message.replace('{Date}'," "+OnlyDate);
                
                Type=0;
                SendMessage=1;
            }else{
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now before  casting",req.body.last_default_message_time);
                    let TimeNow=cast.number(req.body.last_default_message_time)
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now after  casting",TimeNow);
                    let timediff=(TimeNow - FriendsInfo.last_default_message_time)/ (60*60*1000);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Difference",timediff);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Delay",getUserSettings.default_time_delay);
                    if(timediff>getUserSettings.default_time_delay){
                        console.log("Increaessssssssssssssss")
                        Message=getUserSettings.default_message_text;
                        Message=Message.replace('{first_name}'," "+req.body.instagram_username);
                        Message=Message.replace('{last_name}'," "+req.body.instagram_username);
                        Message=Message.replace('{user_name}'," "+req.body.instagram_username);
                        Message=Message.replace('{date}'," "+OnlyDate);
                        Message=Message.replace('{Date}'," "+OnlyDate);
                        Type=0;
                        SendMessage=1;
                    }else{
                        console.log("ZZZZZZZZZZZZZZZZZZZZZ")
                        Message="";
                        Type=0;
                        SendMessage=0;
                    }
            }
        }else{
            if(FriendsInfo.last_default_message_time == 0){
                Message=getUserSettings.default_message_group;
                Type=1;
                SendMessage=1;
            }else{
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now before  casting",req.body.last_default_message_time);
                    let TimeNow=cast.number(req.body.last_default_message_time)
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Now after  casting",TimeNow);
                    let timediff=(TimeNow - FriendsInfo.last_default_message_time)/ (60*60*1000);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Difference",timediff);
                    console.log("This Is the timeeeeeeeeeeeeeeeeeee Delay",getUserSettings.default_time_delay);
                    if(timediff>getUserSettings.default_time_delay){
                        console.log("Increaessssssssssssssss")
                        Message=getUserSettings.default_message_group;
                        Type=1;
                        SendMessage=1;
                    }else{
                        console.log("ZZZZZZZZZZZZZZZZZZZZZ")
                        Message="";
                        Type=1;
                        SendMessage=0;
                    }
            }
        }
        res.send({
            code: 1,
            message: "Success",
            payload: {
                Message: Message,
                Type: Type,
                SendMessage: SendMessage
            }
        })
    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.GetGroupMessageContents =    async   (req, res)  => {
    try{
        console.log("This is send",req.body);
        await MessageGroup.GetMessageGroup(req.body.default_message_group).then(async resultGroup=>{
            let TotalNumberofBlocks=resultGroup.associate_blocks.length;
            let CointNum=Math.floor(Math.random() * TotalNumberofBlocks);
            let randomBlock = resultGroup.associate_blocks[CointNum];
            console.log("This is Random MessageGroup=====",randomBlock);
            if(randomBlock.length>0){
                let i = 0
                let finalMessage = []
                sendResponse = (data) =>{
                res.status(200).send({
                    code: 1,
                    message: "Succefully fetched random message from the selected group",
                    payload: {
                    message: data
                    // data: randomSegment.segment_id.message_blocks[getRandomInt(0,randomSegment.segment_id.message_blocks.length -1)]
                    }
                })
                }
                constructMessage(i,randomBlock,finalMessage,sendResponse,req.body.KeywordParams);
                
            }
        });
    }catch(error){
        res.send({
            code: 31,
            message: error.message,
            payload: error
        })
    }
}
async function constructMessage(i,messageBlock,finalMessage,__callback,KeywordParams){
    let a = new Date(KeywordParams.ChangeDate);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let OnlyDate = date + ' ' + month + ' ' + year ;
    if(messageBlock[i].type == "id"){
                let MessageSegmentDetails=await MessageSegment.GetMessageSegment(messageBlock[i].value);
                //         console.log("This is XXXXXXXXXXXXXXXX =====",MessageSegmentDetails);
                let TotalNumberofSegment=MessageSegmentDetails.message_blocks.length;
                //         console.log("This is XXXXXXXXXXXXXXXX =====",TotalNumberofSegment);
                let CointBlock =Math.floor(Math.random() * TotalNumberofSegment);
                //         console.log("This is XXXXXXXXXXXXXXXX =====",CointBlock);
                let randomSegments = MessageSegmentDetails.message_blocks[CointBlock];
                let newText=randomSegments.replace('{first_name}'," "+KeywordParams.ChangeUserName);
                newText=newText.replace('{last_name}'," "+KeywordParams.ChangeUserName);
                newText=newText.replace('{user_name}'," "+KeywordParams.ChangeUserName);
                newText=newText.replace('{date}'," "+OnlyDate);
                newText=newText.replace('{Date}'," "+OnlyDate);
                
        finalMessage.push(newText)
      }else{
        let newText=messageBlock[i].value.replace('{first_name}', KeywordParams.ChangeUserName);
        newText=newText.replace('{last_name}'," "+KeywordParams.ChangeUserName);
        newText=newText.replace('{user_name}'," "+KeywordParams.ChangeUserName);
        newText=newText.replace('{date}'," "+OnlyDate);
        newText=newText.replace('{Date}'," "+OnlyDate);
        finalMessage.push(newText)
      }
      i++
      if(i < messageBlock.length){
        constructMessage(i,messageBlock,finalMessage,__callback,KeywordParams)
      }else{
        //console.log("message",finalMessage.join(' '))
          return __callback(finalMessage.join(' '))
      }
    //return __callback(messageBlock);
}