
const router = require('express').Router()




  router.use('/user',
  require('./User/router')
  )


  router.use('/setting',
  require('./Setting/router')
  )

  router.use('/autoresponder',
  require('./AutoResponder/router')
  )

  router.use('/messagegroup',
  require('./MessageGroup/router')
  )

  router.use('/friend',
  require('./Friend/router')
  )

module.exports = router