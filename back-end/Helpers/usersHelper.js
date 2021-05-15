const UsersRepo = require('../models/repositories/user.repository');
const AutoResponderRepo = require('../models/repositories/autoresponder.repository');
module.exports.UserdetailsInfo =  async(user_id) =>{
    try{
        let userInfoArray = {};
            let userSettingsArray = {};
            await UsersRepo.GetUserDetailsInfoById(user_id).then(async results=>{
                if(results.length>0){
                    console.log("This is my userInfoArray",results);
                    userInfoArray={
                    user_id:results[0]._id,
                    kyubi_user_token: results[0].kyubi_user_token,
                    instagram_id: results[0].instagram_id,
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
                            default_time_delay: results[0].usersettings.default_time_delay,
                            default_message_type: results[0].usersettings.default_message_type,
                            default_message_group:results[0].usersettings.default_message_group
                        };
                    }
                }
            });
            let statusArray = [];
            await AutoResponderRepo.GetAutoResponderKeywords(user_id).then(async result=>{
                if(result.length>0){
                    await result.map(async individual => {
                        if(individual.autoresponders[0].status===1){
                            statusArray.push({keyword:individual.keywords, message:individual.autoresponders[0].message});
                        }                                    
                    })
                }
            });
            let userInfo={UserInfo:userInfoArray,UserSettings:userSettingsArray,AutoResponderKeywords:statusArray}
            console.log("HIIIIIIIIIIIIIII===========",userInfo);
            return userInfo;

    }catch(error){
        console.log('error in getting the user Details ===>', error);
        return error.message;
    }
}