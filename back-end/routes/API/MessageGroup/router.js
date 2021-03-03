const router      = require('express').Router()
const controller  = require('./controller')

router.post('/create',
controller.MessageGroupCreate  
)


module.exports = router