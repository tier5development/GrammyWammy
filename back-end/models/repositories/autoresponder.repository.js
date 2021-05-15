const mongoose = require('mongoose');
const AutoResponder = require('../models/autoresponder.model');
const AutoResponderKeyword  =   require('../models/autoresponderkeyword.model');
const AutoresponderRepository   =   {
  /**
    * @CreateAutoResponderGroup
    * Get Auto-Responder Group As Per user_id
  */
 CreateAutoResponderGroup: async (data) => {
    try {
        let UserAutoResponder = await AutoResponder.create(data);
      return UserAutoResponder;
    } catch (e) {
      throw e;
    }
  },
  /**
    * @CreateAutoResponderKeyword
    * Get Auto-Responder Group As Per user_id and Autoresponder id
  */
 CreateAutoResponderKeyword: async (data) => {
    try {
        let UserAutoResponderKeyword = await AutoResponderKeyword.create(data);
      return UserAutoResponderKeyword;
    } catch (e) {
      throw e;
    }
  }
  ,
  /**
    * @GetAutoResponderResponder
    * Get Auto-Responder Group As Per user_id and Autoresponder id
  */
 GetAutoResponderResponder: async (autoUserId) => {
    try {
        return await AutoResponder.aggregate([
            {
              $match: {
                'user_id': mongoose.Types.ObjectId(autoUserId),
              }
            },
            {
              $lookup: {
                from: 'autoresponderkeywords',
                localField: '_id',
                foreignField: 'auto_responder_id',
                as: 'autoresponderkeywords'
              }
            },
            {
              $unwind: {
                path: '$autoresponderkeywords',
                preserveNullAndEmptyArrays: true
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
                auto_responder_name: {
                  $first: '$auto_responder_name'
                },
                auto_responder_details: {
                  $first: '$auto_responder_details'
                },
                message: {
                  $first: '$message'
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
                autoresponderkeywords: {
                  $push: '$autoresponderkeywords'
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
 /**
    * @GetAutoResponderResponderWithId
    * Get Auto-Responder Group As Per _id and Autoresponder id
  */
 GetAutoResponderResponderWithId: async (autoId) => {
  try {
      return await AutoResponder.aggregate([
          {
            $match: {
              '_id': mongoose.Types.ObjectId(autoId),
            }
          },
          {
            $lookup: {
              from: 'autoresponderkeywords',
              localField: '_id',
              foreignField: 'auto_responder_id',
              as: 'autoresponderkeywords'
            }
          },
          {
            $unwind: {
              path: '$autoresponderkeywords',
              preserveNullAndEmptyArrays: true
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
              auto_responder_name: {
                $first: '$auto_responder_name'
              },
              auto_responder_details: {
                $first: '$auto_responder_details'
              },
              message: {
                $first: '$message'
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
              autoresponderkeywords: {
                $push: '$autoresponderkeywords'
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
 /**
   * @GetAutoResponderKeywords
   * Get Auto-Responder Keywords As Per user_id
 */
GetAutoResponderKeywords: async (autoUserId) => {
   try {
       return await AutoResponderKeyword.aggregate([
           {
             $match: {
               'user_id': mongoose.Types.ObjectId(autoUserId),
             }
           },
           {
             $lookup: {
               from: 'autoresponders',
               localField: 'auto_responder_id',
               foreignField: '_id',
               as: 'autoresponders'
             }
           },
           {
             $group: {
               '_id': '$_id',
               keywords: {
                 $first: '$keywords'
               },
               createdAt: {
                 $first: '$createdAt'
               },
               updatedAt: {
                 $first: '$updatedAt'
               },
               autoresponders: {
                 $first: '$autoresponders'
               }
             }
           }
         ]).exec();
   } catch (e) {
     throw e;
   }
},
/**
    * @updateAutoResponderById
    * update AutoResponder BY Id
  */
 updateAutoResponderById: async (data, id) => {
  try {
    let updateAutoResponder = await AutoResponder.findByIdAndUpdate(id, data, {
      new: true,
      upsert: true
    }).exec();
    return updateAutoResponder;
  } catch (e) {
    throw e;
  }
},
  /**
    * @DeleteAssociatedAutoResponderKeywords
    * DiAssociate user from instagram pages
  */
 DeleteAssociatedAutoResponderKeywords: async (AutoResponderId, UserId) => {
  try {
    // console.log("Let Me Delete All The Notificationnnnnnn");
    let AutoResponderKeywordDelete = await AutoResponderKeyword.deleteMany({ user_id: mongoose.Types.ObjectId(UserId), auto_responder_id: mongoose.Types.ObjectId(AutoResponderId) });
    return AutoResponderKeywordDelete;
  } catch (e) {
    throw e;
  }
},
  /**
    * @DeleteAutoResponder
    * DiAssociate user from instagram pages
  */
 DeleteAutoResponder: async (AutoResponderId, UserId) => {
  try {
    // console.log("Let Me Delete All The Notificationnnnnnn");
    let AutoResponderDelete = await AutoResponder.deleteMany({ user_id: mongoose.Types.ObjectId(UserId), _id: mongoose.Types.ObjectId(AutoResponderId) });
    return AutoResponderDelete;
  } catch (e) {
    throw e;
  }
},



};

module.exports = AutoresponderRepository;