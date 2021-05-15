const router      = require('express').Router()
const controller  = require('./controller')


router.post('/friendsCreateOrUpdate',
controller.FriendsCreateOrUpdate
)

router.post('/friendsUpdate',
controller.FriendsUpdate
)

router.post('/friendsDefaultMessageCheck',
controller.friendsDefaultMessageCheck
)

router.post('/checkFriendReadyToReciveDefaultMessage',
controller.CheckFriendReadyToReciveDefaultMessage
)
router.post('/friendsUpdateDefaut',
controller.friendsUpdateDefaut
)

router.post('/friendsSaveLastMessageOut',
controller.friendsSaveLastMessageOut
)

router.post('/saveLastMessageOutForFriend',
controller.SaveLastMessageOutForFriend
)

router.post('/fetchMessageGroupAndContents',
controller.fetchMessageGroupAndContents
)

router.post('/getDefaultMessage',
controller.GetDefaultMessage)

router.post('/getGroupMessageContents',
controller.GetGroupMessageContents)

module.exports = router