import Router from 'express-promise-router'
import * as controller from '../controller/users.controller.js'
import { auth } from '../services/auth.services.js'

const router = Router()

router.get('/me', auth.required, controller.getMyUser)
router.get('/me/patterns', auth.required, controller.getMyPatterns)
router.get('/:id', auth.required, controller.getUserById)
router.get('/:id/patterns', auth.required, controller.getUserPatterns)

export default router
