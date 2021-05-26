import Router from 'express-promise-router'
import controller from '../controller/patterns.controller.js'
// import routeProtection from '../controller/routeProtection.controller'

const router = Router()

router.get('/:id', controller.getPattern)
router.get('/', controller.getAllPatterns)
router.get('/pdf/:id/:size?', controller.getPatternPDF)

router.post('/',
  // routeProtection.requireAuth,
  controller.createPattern
)

router.delete('/:id',
  // routeProtection.requireAuth,
  controller.deletePatterns)

router.put('/:id',
  // routeProtection.requireAuth,
  controller.updatePattern)

export default router
