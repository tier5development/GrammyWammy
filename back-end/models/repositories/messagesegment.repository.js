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
  * @updateMessageSegmentById
  * update AutoResponder BY Id
  */
    updateMessageSegmentById: async (data, id) => {
      try {
        let updateMessageSegment = await MessageSegment.findByIdAndUpdate(id, data, {
          new: true,
          upsert: true
        }).exec();
        return updateMessageSegment;
      } catch (e) {
        throw e;
      }
    }
}

module.exports = MessageSegmentRepository;