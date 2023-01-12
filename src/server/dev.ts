import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import devRouter from './routes/dev'
import { Express } from 'express'

export default function (app: Express) {
  const config = require('../../webpack.config.js')
  const compiler = webpack(config)

  app.use(devRouter)
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  )
}
