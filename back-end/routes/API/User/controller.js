const UsersRepo = require('../../../models/repositories/user.repository');
const AutoResponderRepo =   require('../../../models/repositories/autoresponder.repository');
const UserSettingRepository =   require('../../../models/repositories/settings.repository');
module.exports.userFacebook = async (req, res) => {
    try {
        console.log("This is my sent",req.body);
        
        
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_rec);
        console.log("This is my Respo",getUserInfo);
        if(getUserInfo){
            
            let UpdateUserInfo=await UsersRepo.UpdateUser(req.body.user_rec,req.body.fb_id,req.body.fb_name,req.body.fb_username,req.body.fb_image);
            let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfo(req.body.user_rec).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray",results);
                    userInfoArray={
                    user_id:results[0]._id,
                    kyubi_user_token: results[0].kyubi_user_token,
                    facebook_id: results[0].facebook_id,
                    facebook_name: results[0].facebook_name,
                    facebook_profile_name: results[0].facebook_profile_name,
                    facebook_image: results[0].facebook_image,
                    image_url: results[0].image_url,
                    status: results[0].status};
                    if(results[0].usersettings){
                        userSettingsArray={
                            default_message: results[0].usersettings.default_message,
                            default_message_text: results[0].usersettings.default_message_text,
                            autoresponder: results[0].usersettings.autoresponder,
                            default_time_delay: results[0].usersettings.default_time_delay};
                    }
                }
            });
            let statusArray = [];
            await AutoResponderRepo.GetAutoResponderKeywords(getUserInfo._id).then(async result=>{
                if(result.length>0){
                    await result.map(async individual => {
                        if(individual.autoresponders[0].status===1){
                            statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                        }                                    
                    })
                }
            });
            res.send({
                code: 1,
                message: "Successfully User Added",
                payload: {UserInfo:userInfoArray,UserSettings:userSettingsArray,AutoResponderKeywords:statusArray}
            });
        }else{
            let UsersDetailinfo= {
                user_id:req.body._id,
                kyubi_user_token: req.body.user_rec,
                facebook_id: req.body.facebook_id,
                facebook_name: req.body.fb_name,
                facebook_profile_name:req.body.fb_username,
                facebook_image:req.body.fb_image,
                status: 0
            };
            let saveUesr=await UsersRepo.saveUserDetails(UsersDetailinfo);
            let getUserInfoNew = await UsersRepo.GetUserById(req.body.user_rec);
            let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfo(req.body.user_rec).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray",results);
                    userInfoArray={
                    kyubi_user_token: results[0].kyubi_user_token,
                    facebook_fbid: results[0].facebook_id,
                    facebook_name: results[0].facebook_name,
                    facebook_profile_name: results[0].facebook_profile_name,
                    facebook_image: results[0].facebook_image,
                    image_url: results[0].image_url,
                    status: results[0].status};
                    if(results[0].usersettings){
                        userSettingsArray={
                            default_message: results[0].usersettings.default_message,
                            default_message_text: results[0].usersettings.default_message_text,
                            autoresponder: results[0].usersettings.autoresponder,
                            default_time_delay: results[0].usersettings.default_time_delay};
                    }
                }
            });
            let statusArray = [];
            await AutoResponderRepo.GetAutoResponderKeywords(getUserInfoNew._id).then(async result=>{
                if(result.length>0){
                    await result.map(async individual => {
                        if(individual.autoresponders[0].status===1){
                            statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                        }                                    
                    })
                }
            });
            res.send({
                code: 1,
                message: "Successfully User Added",
                payload: {UserInfo:userInfoArray,UserSettings:userSettingsArray,AutoResponderKeywords:statusArray}
            });
        }
        //UsersRepo.GetUserById(userinfo.user.id)
            
        
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.GetUserDetails = async   (req,res)   =>{
    try {
        console.log("This is my sent",req.body);
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_rec);
        console.log("This is my Respo",getUserInfo);
        let userInfoArray = {};
        let userSettingsArray = {};
        let statusArray = [];
        await UsersRepo.GetUserDetailsInfo(req.body.user_rec).then(async results=>{
            if(results.length>0){
                console.log("This is my userInfoArray",results);
                userInfoArray={
                user_id:results[0]._id,
                kyubi_user_token: results[0].kyubi_user_token,
                facebook_fbid: results[0].facebook_id,
                facebook_name: results[0].facebook_name,
                facebook_profile_name: results[0].facebook_profile_name,
                facebook_image: results[0].facebook_image,
                image_url: results[0].image_url,
                status: results[0].status};
                if(results[0].usersettings){
                    userSettingsArray={
                        default_message: results[0].usersettings.default_message,
                        default_message_text: results[0].usersettings.default_message_text,
                        autoresponder: results[0].usersettings.autoresponder,
                        default_time_delay: results[0].usersettings.default_time_delay};
                }
                
                await AutoResponderRepo.GetAutoResponderKeywords(getUserInfo._id).then(async result=>{
                    if(result.length>0){
                        
                        await result.map(async individual => {
                            if(individual.autoresponders[0].status===1){
                                statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                            }                                    
                        })
                        
                    }
                });
            }else{
                let UsersDetailinfo= {
                    kyubi_user_token: req.body.user_rec,
                    status: 0
                };
                console.log(UsersDetailinfo);
                let saveUesr=await UsersRepo.saveUserDetails(UsersDetailinfo);
                console.log(saveUesr);
                userInfoArray={
                    user_id:saveUesr._id,
                    kyubi_user_token: saveUesr.kyubi_user_token,
                    facebook_fbid: saveUesr.facebook_id,
                    facebook_name: saveUesr.facebook_name,
                    facebook_profile_name: saveUesr.facebook_profile_name,
                    facebook_image: saveUesr.facebook_image,
                    image_url: saveUesr.image_url,
                    status: saveUesr.status};
            }
        });
        

        
        //console.log("This is my UserInfo",getUserInfoNew);
        res.send({
            code: 1,
            message: "Successfully User Added",
            payload: {UserInfo:userInfoArray,UserSettings:userSettingsArray,AutoResponderKeywords:statusArray}
        });
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
        
}
module.exports.userCheckStoreNRetrive   =   async   (req,   res)    =>  {
    try {
        console.log("This is my sent",req.body);        
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_rec);
        console.log("This is my Respo",getUserInfo);
        let GetMDBid="";
        if(getUserInfo){
            let  usersDetailsArray=[];
            usersDetailsArray['kyubi_user_token']=req.body.user_rec;
            if(req.body.fb_id !=  ""){
                usersDetailsArray['facebook_id']=req.body.fb_id;
            }
            if(req.body.fb_name !=  ""){
                usersDetailsArray['facebook_name']=req.body.fb_name;
            }
            if(req.body.fb_username !=  ""){
                usersDetailsArray['facebook_profile_name']=req.body.fb_username;
            }
            if(req.body.fb_image !=  ""){
                usersDetailsArray['facebook_image']=req.body.fb_image;
            }
            GetMDBid =getUserInfo._id;
            console.log("Store That",usersDetailsArray);
            let UsersDetailinfo=Object.assign({}, usersDetailsArray);
            console.log("Store That IS",UsersDetailinfo);
            let UpdateUserInfo=await UsersRepo.UpdateUserInfo(req.body.user_rec,UsersDetailinfo);

        }else{

            let  usersDetailsArray=[];
            usersDetailsArray['kyubi_user_token']=req.body.user_rec;
            if(req.body.fb_id !=  ""){
                usersDetailsArray['facebook_id']=req.body.fb_id;
            }
            if(req.body.fb_name !=  ""){
                usersDetailsArray['facebook_name']=req.body.fb_name;
            }
            if(req.body.fb_username !=  ""){
                usersDetailsArray['facebook_profile_name']=req.body.fb_username;
            }
            if(req.body.fb_image !=  ""){
                usersDetailsArray['facebook_image']=req.body.fb_image;
            }
            
            console.log("Store That",usersDetailsArray);
            let UsersDetailinfo=Object.assign({}, usersDetailsArray);
            console.log("Store That IS",UsersDetailinfo);
            let saveUesr=await UsersRepo.saveUserDetails(UsersDetailinfo);
            console.log("Show That IS",saveUesr._id);
            let UsersSettingsDetailinfo= {
                user_id: saveUesr._id,
                default_message: 0,
                default_message_text: "",
                autoresponder: 0
              };
            let getUserSettingsNew=await UserSettingRepository.saveUserSettingsDetails(UsersSettingsDetailinfo);
            GetMDBid =saveUesr._id;
        }
            let getUserInfoNew = await UsersRepo.GetUserById(req.body.user_rec);
            let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfo(req.body.user_rec).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray",results);
                    userInfoArray={
                    user_id:results[0]._id,
                    kyubi_user_token: results[0].kyubi_user_token,
                    facebook_fbid: results[0].facebook_id,
                    facebook_name: results[0].facebook_name,
                    facebook_profile_name: results[0].facebook_profile_name,
                    facebook_image: results[0].facebook_image,
                    image_url: results[0].image_url,
                    status: results[0].status};
                    if(results[0].usersettings){
                        userSettingsArray={
                            default_message: results[0].usersettings.default_message,
                            default_message_text: results[0].usersettings.default_message_text,
                            autoresponder: results[0].usersettings.autoresponder,
                            default_time_delay: results[0].usersettings.default_time_delay};
                    }
                }
            });
            let statusArray = [];
            await AutoResponderRepo.GetAutoResponderKeywords(getUserInfoNew._id).then(async result=>{
                if(result.length>0){
                    await result.map(async individual => {
                        if(individual.autoresponders[0].status===1){
                            statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                        }                                    
                    })
                }
            });
            res.send({
                code: 1,
                message: "Successfully User Added",
                payload: {UserInfo:userInfoArray,UserSettings:userSettingsArray,AutoResponderKeywords:statusArray}
            });
        
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.userRetrive  =   async   (req,   res)    =>  {
    try {
            console.log("This is my sent",req.body);        
            let getUserInfoNew = await UsersRepo.GetUserById(req.body.user_rec);
            let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfo(req.body.user_rec).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray =======================>",results);
                    userInfoArray={
                    user_id:results[0]._id,
                    kyubi_user_token: results[0].kyubi_user_token,
                    facebook_fbid: results[0].facebook_id,
                    facebook_name: results[0].facebook_name,
                    facebook_profile_name: results[0].facebook_profile_name,
                    facebook_image: results[0].facebook_image,
                    image_url: results[0].image_url,
                    status: results[0].status};
                    if(results[0].usersettings){
                        userSettingsArray={
                            default_message: results[0].usersettings.default_message,
                            default_message_text: results[0].usersettings.default_message_text,
                            autoresponder: results[0].usersettings.autoresponder,
                            default_time_delay: results[0].usersettings.default_time_delay,
                            default_message_type: results[0].usersettings.default_message_type,
                            default_message_group:results[0].usersettings.default_message_group
                        };
                            
                    }
                }
            });
            let statusArray = [];
            await AutoResponderRepo.GetAutoResponderKeywords(getUserInfoNew._id).then(async result=>{
                if(result.length>0){
                    await result.map(async individual => {
                        if(individual.autoresponders[0].status===1){
                            statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                        }                                    
                    })
                }
            });
            res.send({
                code: 1,
                message: "Successfully User Added1111",
                payload: {UserInfo:userInfoArray,UserSettings:userSettingsArray,AutoResponderKeywords:statusArray}
            });
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}

