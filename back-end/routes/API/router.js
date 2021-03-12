
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

  router.use('/friend',
  require('./Friend/router')
  )

  router.use('/segment',
  require('./Segment/router')
  )

  router.use('/group',
  require('./Group/router')
  )

module.exports = router