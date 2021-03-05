const router      = require('express').Router()
const controller  = require('./controller')



router.post('/userInstagram',
controller.userInstagram  
)

router.post('/getUserDetails',
controller.GetUserDetails
)

module.exports = router