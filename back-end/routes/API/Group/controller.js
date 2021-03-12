
const MessageGroup    =   require('../../../models/repositories/messagegroup.repository');
module.exports.createGroup = async (req, res) => {
    try {
        let mess="";
        let code=1;
        let messageGroup = [];
        //console.log("This is my sent",req.body);
        
        if(req.body.group_name !="" && req.body.user_id !=""  && req.body.BlockStorage !=""){
            let payload ={
                user_id:req.body.user_id,
                title:req.body.group_name,
                associate_blocks:req.body.BlockStorage
            }
            await MessageGroup.CreateMessageGroup(payload).then(async result=>{
                messageGroup=await MessageGroup.GetAllMessageGroup(req.body.user_id);
                mess="Group Created Successfully";
                code=1;
            }).catch(error=>{
                mess=error.message;
                code=2;
            });
            
            
            
            console.log("This is my GetAllMessageSegment",messageGroup);
        }else{
            mess="Group Create UnSuccessfull Due To Input";
            code=2;
        }
        
        //console.log("This is my message",mess);
        res.send({
            code: code,
            message: mess,
            payload: messageGroup
        })
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.listGroup  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        let messageGroup = [];
        if(req.body.user_id !=""  ){
            messageGroup=await MessageGroup.GetAllMessageGroup(req.body.user_id);
            mess="Group List Successfully";
            code=1;
        }else{
            mess="Group List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageGroup
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.editGroup  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        if(req.body.group_id !=""  ){
            MessageGroups=await MessageGroup.GetMessageGroup(req.body.group_id);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: MessageGroups
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.updateGroup  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        if(req.body.group_id_edit !=""  ){
            let payload ={
                title:req.body.group_name_edit,
                associate_blocks:req.body.BlockStorage
            }
            let updateMessageGroup=await MessageGroup.updateMessageGroupById(payload,req.body.group_id_edit);
            messageGroup=await MessageGroup.GetAllMessageGroup(req.body.user_id);
            //messageSegment=await MessageSegment.GetMessageSegment(req.body.sagment_id_edit);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageGroup
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}