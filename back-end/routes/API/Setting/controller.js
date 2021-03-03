const UsersRepo = require('../../../models/repositories/user.repository');
const UserSettingRepository =   require('../../../models/repositories/settings.repository');
const AutoResponderRepo =   require('../../../models/repositories/autoresponder.repository');
const UserHelper = require('../../../Helpers/usersHelper')
const cast = require('TypeCast');
module.exports.autoresponder = async (req, res) => {
    try {
        console.log("This is my sent",req.body.user_id);
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        if(getUserInfo._id){
            let getUserSettings= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
            let AutoResponderDetails= await AutoResponderRepo.GetAutoResponderResponder(getUserInfo._id);
            if(getUserSettings){
                let AutoResponderDetails= await AutoResponderRepo.GetAutoResponderResponder(getUserInfo._id);
                console.log(AutoResponderDetails);
                res.send({
                            code: 1,
                            message: "Successfull",
                            payload:{setting:getUserSettings.autoresponder,autokey:AutoResponderDetails}
                        });
            }else{
                res.send({
                    code: 1,
                    message: "Successfull",
                    payload:0
                });
            }
            
        }else{
            res.send({
                code: 4,
                message: "Sorry No Data Of Parent",
                payload: ""
            })
        }

       
        
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}

module.exports.updateautoresponder  =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        //let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        let getUserSettings= await UserSettingRepository.GetUserSettingById(req.body.user_id);
        console.log(getUserSettings);
        if(getUserSettings){
            let UserSettingsInfoPayload= {
                autoresponder:req.body.autoresponder
              };
              let updateUserSettingsInfo=await UserSettingRepository.UpdateUserSettingsById(req.body.user_id,req.body.autoresponder);
             let  userInfo= UserHelper.UserdetailsInfo(req.body.user_id).then(result=>{
                console.log("yo yo +++++++++++++++++",result);
                    res.send({
                        code: 1,
                        message: "Successfull",
                        payload: result
                    });
             }).catch(error => {
                res.send({
                    code: 2,
                    message: error.message,
                    payload: error
                });
             });
             
            
            }else{
                res.send({
                    code: 2,
                    message: "Error",
                    payload: {}
                });
            }
        // if(getUserInfo._id){
        //     let getUserSettings= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
        //     if(getUserSettings){
         //        let getUserSettingsNew=await UserSettingRepository.UpdateUserSettingsDetails(getUserInfo._id,req.body.autoresponder).then(async result=>{
        //             let getUserSettingsUpdated= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
        //             res.send({
        //                 code: 1,
        //                 message: "Successfull",
        //                 payload: getUserSettingsUpdated.autoresponder
        //             });
        //           });
                
        //     }else{
        //         let UsersSettingsDetailinfo= {
        //             user_id: getUserInfo._id,
        //             autoresponder: req.body.autoresponder
        //           };
        //           let getUserSettingsNew=await UserSettingRepository.saveUserSettingsDetails(UsersSettingsDetailinfo).then(async result=>{
                    
        //             let getUserSettingsUpdated= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
        //             res.send({
        //                 code: 1,
        //                 message: "Successfull",
        //                 payload: getUserSettingsUpdated.autoresponder
        //             });
        //           });
                
        //     }
        // }else{
        //     res.send({
        //         code: 4,
        //         message: "Sorry No Data Of Parent",
        //         payload: ""
        //     })
        // }
        
    }   catch  (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.createautorespondergroup =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        if(getUserInfo._id){
            let UsersAutoResponderinfo= {
                user_id: getUserInfo._id,
                auto_responder_name: req.body.autoname,
                auto_responder_details:req.body.autodesc,
                message:req.body.automessage,
                status:0
              };
            let AutoResponderGroup=await AutoResponderRepo.CreateAutoResponderGroup(UsersAutoResponderinfo);
            

             let strArr = req.body.autokey.split(',');

                for(var i=0; i<strArr.length; i++){

                    let UsersAutoResponderKeywordinfo= {
                            user_id: getUserInfo._id,
                            auto_responder_id: AutoResponderGroup._id,
                            keywords:strArr[i]
                        };
                    await AutoResponderRepo.CreateAutoResponderKeyword(UsersAutoResponderKeywordinfo);
                }
                res.send({
                    code: 1,
                    message: "TheKeyWords Is Saved SuccessFully",
                    payload: req.body
                }) 
            
        }else{
            res.send({
                code: 3,
                message: "There is a error in user",
                payload: req.body
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
module.exports.getautoresponderkeywords =   async   (req, res)  =>  {
    try{
        console.log("This is my sent",req.body);
        let getUserInfo = await UsersRepo.GetUserById(req.body.user.id);
        if(getUserInfo._id){
            let getUserSettings= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
            if(getUserSettings){
                if(getUserSettings.autoresponder === 0){
                    res.send({
                        code: 1,
                        message: "success",
                        payload: {user:getUserInfo,autoresponder:0,setting:getUserSettings}
                    })
                }else{
                    let statusArray = [];
                    await AutoResponderRepo.GetAutoResponderKeywords(getUserInfo._id).then(async result=>{

                        if(result.length>0){
                            
                            await result.map(async individual => {
                                    statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                            })
                            
                        }
                    });

                    res.send({
                        code: 1,
                        message: "success",
                        payload: {user:getUserInfo,autoresponder:1,keywords:statusArray}
                    })
                }
                
            }else{
                res.send({
                    code: 1,
                    message: "success",
                    payload: {autoresponder:0}
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
module.exports.setsetting   =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        let getUserInfo = await UsersRepo.GetUserById(req.body.kyubi_user_token);
        if(getUserInfo._id){
            let getUserSettings= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
            if(getUserSettings){
                console.log("This arexxxxxxxxxxxxx",getUserSettings);
                let UsersSettingsDetailinfo= {
                    default_message: req.body.defaultmessage,
                    default_message_text: req.body.default_message_text,
                    autoresponder: req.body.autoresponder,
                    default_time_delay: cast.number(req.body.default_time_delay)
                  };
                  let UpdateUserSettingsNew=await UserSettingRepository.UpdateUserSettingsDetails(
                        getUserInfo._id,
                        req.body.defaultmessage,
                        req.body.default_message_text,
                        req.body.autoresponder,
                        cast.number(req.body.default_time_delay)
                    );
                    let  userInfo= UserHelper.UserdetailsInfo(getUserInfo._id).then(result=>{
                        console.log("yo yo +++++++++++++++++",result);
                            res.send({
                                code: 1,
                                message: "Successfull",
                                payload: result
                            });
                     }).catch(error => {
                        res.send({
                            code: 2,
                            message: error.message,
                            payload: error
                        });
                     });

            }else{
                let UsersSettingsDetailinfo= {
                    user_id: getUserInfo._id,
                    default_message: req.body.defaultmessage,
                    default_message_text: req.body.default_message_text,
                    autoresponder: req.body.autoresponder,
                    default_time_delay: cast.number(req.body.default_time_delay)
                  };
                  let getUserSettingsNew=await UserSettingRepository.saveUserSettingsDetails(UsersSettingsDetailinfo);
                  
                  let  userInfo= UserHelper.UserdetailsInfo(getUserInfo._id).then(result=>{
                    console.log("yo yo +++++++++++++++++",result);
                        res.send({
                            code: 1,
                            message: "Successfull",
                            payload: result
                        });
                 }).catch(error => {
                    res.send({
                        code: 2,
                        message: error.message,
                        payload: error
                    });
                 });
            }
        }
        
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.getSetting   =   async   (req,   res)    =>  {
    try{
        let getUserInfo = await UsersRepo.GetUserById(req.body.kyubi_user_token);
        if(getUserInfo._id){
            let getUserSettings= await UserSettingRepository.GetUserSettingById(getUserInfo._id);
            if(getUserSettings){
                res.send({
                    code: 1,
                    message: "success",
                    payload: getUserSettings
                })
            }else{
                res.send({
                    code: 2,
                    message: "success",
                    payload: {}
                })
            }
        }else{
            res.send({
                code: 2,
                message: "success",
                payload: {}
            })
        }
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}
module.exports.getUserDetails   =   async   (req,   res)    =>  {
    try{
        let  userInfo= UserHelper.UserdetailsInfo(req.body.user_id).then(result=>{
            console.log("yo yo +++++++++++++++++",result);
                res.send({
                    code: 1,
                    message: "Successfull",
                    payload: result
                });
         }).catch(error => {
            res.send({
                code: 2,
                message: error.message,
                payload: error
            });
         });

    }catch(error){
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
