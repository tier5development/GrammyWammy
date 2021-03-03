const UsersRepo = require('../../../models/repositories/user.repository');
const UserSettingRepository =   require('../../../models/repositories/settings.repository');
const MessageGroupRepo =   require('../../../models/repositories/messagegroup.repository');
const cast = require('TypeCast');

module.exports.MessageGroupCreate  =   async   (req,   res)    =>  {
    try{
        console.log("This is my sent",req.body);
        // let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        // if(getUserInfo._id){
            let UsersMessageGroupinfo= {
                message_group_name: req.body.message_group_name,
                message_group_description:req.body.message_group_description,
                status:0
              };
              let AutoResponderGroup=await MessageGroupRepo.CreateMessageGroup(UsersMessageGroupinfo);
              
        // }else{
        //     res.send({
        //         code: 3,
        //         message: "There is a error in user",
        //         payload: req.body
        //     })
        // }
        
    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }
}