const router      = require('express').Router()
const controller  = require('./controller')



router.post('/userfacebook',
controller.userFacebook  
)

router.post('/getUserDetails',
controller.GetUserDetails
)

module.exports = router