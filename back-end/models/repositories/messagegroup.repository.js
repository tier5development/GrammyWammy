const mongoose = require('mongoose');
const MessageGroup = require('../models/messagegroup.model');

const MessagegroupRepository   =   {
  /**
    * @CreateAutoResponderGroup
    * Get Message Group As Per user_id
  */
 CreateMessageGroup: async (data) => {
    try {
        let UserMessageGroup = await MessageGroup.create(data);
      return UserMessageGroup;
    } catch (e) {
      throw e;
    }
  }
};

module.exports = MessagegroupRepository;