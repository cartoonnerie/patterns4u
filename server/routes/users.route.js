import Router from 'express-promise-router'
import * as controller from '../controller/users.controller.js'

const router = Router()

router.get('/:id', controller.getUserById)
router.get('/patterns/:id', controller.getUserPatterns)

export default router
