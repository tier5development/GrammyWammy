
const MessageSegment    =   require('../../../models/repositories/messagesegment.repository');
const UsersRepo = require('../../../models/repositories/user.repository');
module.exports.createSegment = async (req, res) => {
    try {
        let mess="";
        let code=1;
        let messageSegment = [];
        //console.log("This is my sent",req.body);
        
        if(req.body.message_segment_name !="" && req.body.user_id !=""  && req.body.message_segments_block !=""){
            let payload ={
                user_id:req.body.user_id,
                title:req.body.message_segment_name,
                message_blocks:req.body.message_segments_block
            }
            await MessageSegment.CreateMessageSegment(payload).then(async result=>{
                messageSegment=await MessageSegment.GetAllMessageSegment(req.body.user_id);
                mess="Segments Created Successfully";
                code=1;
            }).catch(error=>{
                mess=error.message;
                code=2;
            });
            
            
            
            console.log("This is my GetAllMessageSegment",messageSegment);
        }else{
            mess="Segments Create UnSuccessfull Due To Input";
            code=2;
        }
        
        //console.log("This is my message",mess);
        res.send({
            code: code,
            message: mess,
            payload: messageSegment
        })
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.listSegment  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        let messageSegment = [];
        if(req.body.user_id !=""  ){
            messageSegment=await MessageSegment.GetAllMessageSegment(req.body.user_id);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageSegment
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.editSegment  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        if(req.body.segment_id !=""  ){
            messageSegment=await MessageSegment.GetMessageSegment(req.body.segment_id);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageSegment
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}

module.exports.updateSegment  =   async   (req,   res)    =>  {
    try{

        console.log("This is my sent",req.body);
        let segmentDetails= await MessageSegment.GetSegmentWithId(req.body.sagment_id_edit);
        console.log(req.body.user_id+'User Id');
        let getUserInfo = await UsersRepo.GetUserById(req.body.user_id);
        console.log(getUserInfo);
        if(segmentDetails){
            console.log('Condition Satisfied');
            console.log(segmentDetails);
            let UserSegmentinfo= {
                title: req.body.message_segment_name,
                message_blocks:req.body.message_segments_block,
                is_active:true
              };
              let updateSegment=await MessageSegment.updateSegmentById(UserSegmentinfo,req.body.sagment_id_edit);
              res.send({
                code: 1,
                message: "Successfull",
                payload:await MessageSegment.GetAllMessageSegment(req.body.user_id)
            });
        }

    }catch(error){
        res.send({
            code: 3,
            message: "Error",
            payload: error.message
        })
    }

}