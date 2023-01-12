import { Request, Response, NextFunction } from 'express'

export function redirectToMainPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.redirect('/main/main.html')
}

export function redirectToChatRoomPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.redirect('/chatRoom/chatRoom.html')
}

export function sendToMainPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.sendFile('/main/main.html')
}

export function sendToChatRoomPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.sendFile('/chatRoom/chatRoom.html')
}
