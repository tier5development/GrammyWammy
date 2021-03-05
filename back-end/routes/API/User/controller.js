const UsersRepo = require('../../../models/repositories/user.repository');
const AutoResponderRepo =   require('../../../models/repositories/autoresponder.repository');

module.exports.userInstagram = async (req, res) => {
    try {
        console.log("This is my sent",req.body);
        
        
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_rec);
        console.log("This is my Respo",getUserInfo);
        if(getUserInfo){
            
            let UpdateUserInfo=await UsersRepo.UpdateUser(req.body.user_rec,req.body.insta_name,req.body.insta_username,req.body.insta_image);
            let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfo(req.body.user_rec).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray1",results);
                    userInfoArray={
                    user_id:results[0]._id,
                    kyubi_user_token: results[0].kyubi_user_token,
                    instagram_name: results[0].instagram_name,
                    instagram_profile_name: results[0].instagram_profile_name,
                    instagram_image: results[0].instagram_image,
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
                instagram_name: req.body.insta_name,
                instagram_profile_name:req.body.insta_username,
                instagram_image:req.body.insta_image,
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
                    user_id:results[0]._id,
                    kyubi_user_token: results[0].kyubi_user_token,
                    instagram_name: results[0].instagram_name,
                    instagram_profile_name: results[0].instagram_profile_name,
                    instagram_image: results[0].instagram_image,
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
        await AutoResponderRepo.GetAutoResponderKeywords(getUserInfo._id).then(async result=>{
            if(result.length>0){
                
                await result.map(async individual => {
                    if(individual.autoresponders[0].status===1){
                        statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                    }                                    
                })
                
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

