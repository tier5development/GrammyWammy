const router      = require('express').Router()
const controller  = require('./controller')



router.post('/userInstagram',
controller.userInstagram  
)

router.post('/getUserDetails',
controller.GetUserDetails
)

router.post('/userCheckStoreNRetrive',
controller.userCheckStoreNRetrive
)

router.post('/userRetrive',
controller.userRetrive
)

module.exports = router