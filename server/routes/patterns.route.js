import Router from 'express-promise-router'
import * as controller from '../controller/patterns.controller.js'
import { auth } from '../services/auth.services.js'

const router = Router()

router.get('/', auth.optional, controller.getAllPatterns)
router.post('/', auth.required, controller.createPattern)

router.get('/', auth.required /* TODO conceive controller for that */)

router.get('/:id', auth.optional, controller.getPatternById)
router.delete('/:id', auth.required, controller.deletePatterns)
router.put('/:id', auth.required, controller.updatePattern)

router.get('/pdf/:id/:size?', auth.required, controller.getPatternPDF)

export default router
