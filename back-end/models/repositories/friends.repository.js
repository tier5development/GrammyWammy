const mongoose = require('mongoose');
const Friends = require('../models/friends.model');

const FriendsRepository   =   {
  /**
    * @GetUserByUserFacebookID
    * Get user As Per user_id  and Facebook ID
  */
 GetUserByUserFacebookID: async (UserId,FacebookID,FacebookUserId) => {
    try {
      let FriendsInfo = await Friends.findOne({ 'user_id': mongoose.Types.ObjectId(UserId),'facebook_id': FacebookID,'facebook_user_id': FacebookUserId}).exec();
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