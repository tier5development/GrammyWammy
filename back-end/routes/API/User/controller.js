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
        
        let dataParse = JSON.parse(req.body.user_rec);
        let getUserInfo = await UsersRepo.GetUserById(dataParse.user.id);
        console.log("This is my Respo",getUserInfo);
        if(getUserInfo){
            
            let UpdateUserInfo=await UsersRepo.UpdateUser(dataParse.user.id,dataParse.user.first_name,dataParse.user.first_name,'images/no_profile_pic.png');
            let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfo(dataParse.user.id).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray while Fetching",results);
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
            let dataParse = JSON.parse(req.body.user_rec);
            console.log(dataParse.user.id);
            let UsersDetailinfo= {
                user_id:req.body._id,
                kyubi_user_token: dataParse.user.id,
                instagram_name: dataParse.user.first_name,
                instagram_profile_name:dataParse.user.first_name,
                instagram_image:'images/no_profile_pic.png',
                status: 0
            };
        console.log(UsersDetailinfo);
        let saveUesr=await UsersRepo.saveUserDetails(UsersDetailinfo);
            let getUserInfoNew = await UsersRepo.GetUserById(dataParse.user.id);
            let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfo(dataParse.user.id).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray while Inserting First Time",results);
                    userInfoArray={
                    user_id:results[0]._id,
                    kyubi_user_token: results[0].kyubi_user_token,
                    instagram_name: results[0].instagram_name,
                    instagram_profile_name: results[0].instagram_profile_name,
                    instagram_image: results[0].instagram_image,
                    image_url: results[0].image_url,
                    status: results[0].status};
                    console.log('User Array ',userInfoArray);
                    if(results[0].usersettings){
                        userSettingsArray={
                            default_message: results[0].usersettings.default_message,
                            default_message_text: results[0].usersettings.default_message_text,
                            autoresponder: results[0].usersettings.autoresponder,
                            default_time_delay: results[0].usersettings.default_time_delay};
                    }
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
                        message: "Successfully User Added First Time",
                        payload: {UserInfo:userInfoArray,UserSettings:userSettingsArray,AutoResponderKeywords:statusArray}
                    });
                }
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

