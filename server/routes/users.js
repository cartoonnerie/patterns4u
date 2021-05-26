import Router from 'express-promise-router'
import controller from '../controller/users.controller.js'

const router = Router()

router.get('/:id', controller.getUserById)

export default router
