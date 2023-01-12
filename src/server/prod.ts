import express, { Express } from 'express'
import path from 'node:path'
import compression from 'compression'
import serverRouter from './routes/prod'

export default function (app: Express) {
  app.use(compression())
  app.use(express.static(path.resolve(__dirname, '../../dist')))
  app.use(serverRouter)
}
