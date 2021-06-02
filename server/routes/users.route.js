import Router from 'express-promise-router'
import * as controller from '../controller/users.controller.js'

const router = Router()

router.get('/:id', controller.getUserById)
router.get('/:id/patterns', controller.getUserPatterns)

export default router
