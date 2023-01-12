import express from 'express'
import { redirectToMainPage, redirectToChatRoomPage } from '../controllers'

const router = express.Router()

router.get('/', redirectToMainPage)
router.get('/main', redirectToMainPage)
router.get('/chatRoom', redirectToChatRoomPage)

export default router
