const mongoose = require('mongoose');
const Friends = require('../models/friends.model');

const FriendsRepository   =   {
  /**
    * @GetUserByUserinstagramID
    * Get user As Per user_id  and instagram ID
  */
 GetUserByUserinstagramID: async (instagramUserId) => {
    try {
      let FriendsInfo = await Friends.findOne({ 'instagram_user_id': instagramUserId}).exec();
      return FriendsInfo;
    } catch (e) {
      throw e;
    }
  },
  
    /**
    * @CreateFriendsInfo
    * Get Friends As Per user_id
  */
 CreateFriendsInfo: async (data) => {
    try {
        let UserFriends = await Friends.create(data);
      return UserFriends;
    } catch (e) {
      throw e;
    }
  },
/**
  * @updateFriendsInfoById
  * update FriendsInfo BY Id
*/
updateFriendsInfoById: async (data, id) => {
try {
  let updateFriends = await Friends.findByIdAndUpdate(id, data, {
    new: true,
    upsert: true
  }).exec();
  return updateFriends;
} catch (e) {
  throw e;
}
},
}

module.exports = FriendsRepository;