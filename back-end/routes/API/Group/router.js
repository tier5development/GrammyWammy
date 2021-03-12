const router      = require('express').Router()
const controller  = require('./controller')



router.post('/create',
controller.createGroup  
)
router.post('/list',
controller.listGroup  
)
router.post('/edit',
controller.editGroup  
)
router.post('/update',
controller.updateGroup  
)

module.exports = router