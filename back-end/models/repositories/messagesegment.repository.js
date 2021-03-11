const mongoose = require('mongoose');
const MessageSegment    =   require('../models/messagesegments.model');
const MessageSegmentRepository   =   {
/**
* @CreateMessageSegment
* Get MessageSegment Group As Per user_id
*/
 CreateMessageSegment: async (data) => {
    try {
        let UserMessageSegment = await MessageSegment.create(data);
      return UserMessageSegment;
    } catch (e) {
      throw e;
    }
  },
/**
* @getAllMessageSegment
* get the Segments info by a specified field from Mongo DB
*/
 GetAllMessageSegment: async (id) => {
    try {
      let MessageSegmentInfo = await MessageSegment.find({ 'user_id': mongoose.Types.ObjectId(id) }).exec();
      return MessageSegmentInfo;
    } catch (e) {
      throw e;
    }
  },
  /**
  * @getMessageSegment
  * get the Segments info by a specified field from Mongo DB
  */
   GetMessageSegment: async (id) => {
      try {
        let MessageSegmentInfo = await MessageSegment.findOne({ '_id': mongoose.Types.ObjectId(id) }).exec();
        return MessageSegmentInfo;
      } catch (e) {
        throw e;
      }
    },
     /**
    * @GetSegmentWithId
    * Get Auto-Responder Group As Per _id and Autoresponder id
  */
  GetSegmentWithId: async (segmentId) => {
  try {
      return await MessageSegment.aggregate([
          {
            $match: {
              '_id': mongoose.Types.ObjectId(segmentId),
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'users'
            }
          },
          {
            $group: {
              '_id': '$_id',
              title: {
                $first: '$title'
              },
              message_blocks: {
                $first: '$message_blocks'
              },
              is_active: {
                $first: '$is_active'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              },
              users: {
                $first: '$users'
              }
            }
          }
        ]).exec();
  } catch (e) {
    throw e;
  }
},
updateSegmentById: async (data, id) => {
  try {
    let updateSegment = await MessageSegment.findByIdAndUpdate(id, data, {
      new: true,
      upsert: true
    }).exec();
    return updateSegment;
  } catch (e) {
    throw e;
  }
}
}

module.exports = MessageSegmentRepository;