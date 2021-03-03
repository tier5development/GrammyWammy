const mongoose = require('mongoose');
const UserSetting = require('../models/usersettings.model');

const UserSettingRepository   =   {
  /**
    * @GetUserSettingById
    * Get user Setting As Per user_id
  */
 GetUserSettingById: async (UserId) => {
    try {
      let UserSettingInfo = await UserSetting.findOne({ 'user_id': mongoose.Types.ObjectId(UserId) }).exec();
      return UserSettingInfo;
    } catch (e) {
      throw e;
    }
  },
    /**
    * @saveUserSettingsDetails
    * save User Setting Details in mongo db
  */
 saveUserSettingsDetails: async (data) => {
    try {
      let UserSettingInfo = await UserSetting.create(data);
      if (!UserSettingInfo) {
        return null;
      }
      return UserSettingInfo;
    } catch (e) {
      throw e;
    }
  },
    /**
    * @UpdateUserSettingsDetails
    * update User  Setting details For Auto-responder
  */
 UpdateUserSettingsDetails: async (userId, default_message,default_message_text,autoresponder,default_time_delay) => {
    try {
      let UserSettingInfo = await UserSetting.updateOne({ user_id:mongoose.Types.ObjectId(userId)  }, {
          default_message: default_message,
          default_message_text: default_message_text,
          autoresponder: autoresponder,
          default_time_delay: default_time_delay
      }).exec();
      return UserSettingInfo;
    } catch (error) {
      throw error;
    }
  },
  /**
  * @UpdateUserSettingsById
  * update User Settings BY Id
*/
UpdateUserSettingsById: async (userId,autoresponder) => {
  try {
    let UserSettingInfo = await UserSetting.updateOne({ user_id:mongoose.Types.ObjectId(userId)  }, {
      autoresponder: autoresponder
  }).exec();
  return UserSettingInfo;
  } catch (e) {
    throw e;
  }
  },
};

module.exports = UserSettingRepository;