const User = require('../models/users.model');
const mongoose = require('mongoose');
const UsersRepository   =   {
  /**
    * @GetUserById
    * Get user As Per _id
  */
 GetUserById: async (UserId) => {
    try {
      let UserInfo = await User.findOne({ 'kyubi_user_token': UserId }).exec();
      return UserInfo;
    } catch (e) {
      throw e;
    }
  },
    /**
    * @saveUserDetails
    * save User Details in mongo db
  */
 saveUserDetails: async (data) => {
    try {
      let UserInfo = await User.create(data);
      if (!UserInfo) {
        return null;
      }
      return UserInfo;
    } catch (e) {
      throw e;
    }
  },
  /**
    * @UpdateUser
    * update User Info
  */
 UpdateUser: async (userId, instagram_id,instagram_name,instagram_profile_name,instagram_image) => {
  try {
    let UpdateUserInfo = await User.updateOne({ kyubi_user_token: userId }, {instagram_id: instagram_id,
      instagram_name: instagram_name,
      instagram_profile_name:instagram_profile_name,
      instagram_image:instagram_image
    }).exec();
    // console.log("Already Associated with", ChatRoomUpdated);
    return UpdateUserInfo;
    } catch (error) {
      throw error;
    }
  },
    /**
    * @UpdateUserInfo
    * update User Info
  */
 UpdateUserInfo: async (userId, UserInfo) => {
  try {
    let UpdateUserInfo = await User.updateOne({ kyubi_user_token: userId }, UserInfo).exec();
    // console.log("Already Associated with", ChatRoomUpdated);
    return UpdateUserInfo;
    } catch (error) {
      throw error;
    }
  },
  GetUserDetailsInfo: async (Kyubi_User_Id) =>  {
    try {
      return await User.aggregate([
          
          {
            $lookup: {
              from: 'usersettings',
              localField: '_id',
              foreignField: 'user_id',
              as: 'usersettings'
            }
          },
          {
            $unwind: {
              path: '$usersettings',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              'kyubi_user_token': Kyubi_User_Id
            }
          },
          {
            $group: {
              '_id': '$_id',
              kyubi_user_token: {
                $first: '$kyubi_user_token'
              },
              instagram_id: {
                $first: '$instagram_id'
              },
              instagram_name: {
                $first: '$instagram_name'
              },
              instagram_profile_name: {
                $first: '$instagram_profile_name'
              },
              instagram_image: {
                $first: '$instagram_image'
              },
              image_url: {
                $first: '$image_url'
              },
              status: {
                $first: '$status'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              },
              usersettings: {
                $first: '$usersettings'
              }
            }
          }
        ]).exec();
  } catch (e) {
    throw e;
  }
  },
  GetUserDetailsInfoById: async (User_Id) =>  {
    try {
      return await User.aggregate([
        {
          $match: {
            '_id': mongoose.Types.ObjectId(User_Id)
          }
        },
          {
            $lookup: {
              from: 'usersettings',
              localField: '_id',
              foreignField: 'user_id',
              as: 'usersettings'
            }
          },
          {
            $unwind: {
              path: '$usersettings',
              preserveNullAndEmptyArrays: true
            }
          },
         
          {
            $group: {
              '_id': '$_id',
              kyubi_user_token: {
                $first: '$kyubi_user_token'
              },
              instagram_id: {
                $first: '$instagram_id'
              },
              instagram_name: {
                $first: '$instagram_name'
              },
              instagram_profile_name: {
                $first: '$instagram_profile_name'
              },
              instagram_image: {
                $first: '$instagram_image'
              },
              image_url: {
                $first: '$image_url'
              },
              status: {
                $first: '$status'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              },
              usersettings: {
                $first: '$usersettings'
              }
            }
          }
        ]).exec();
  } catch (e) {
    throw e;
  }
  }

};

module.exports = UsersRepository;