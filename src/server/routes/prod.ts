import express from 'express'
import { sendToMainPage, sendToChatRoomPage } from '../controllers'

const router = express.Router()

router.get('/', sendToMainPage)
router.get('/main', sendToMainPage)
router.get('/chatRoom', sendToChatRoomPage)

export default router
