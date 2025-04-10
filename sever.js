import express from 'express'
import bodyParser from 'body-parser'
import sequelize, { models } from './src/Common/Sequelizes/ConnectDB.js'
import rootRouter from './src/Route/root.route.js'
import { handlerError } from './src/Common/helpers/error.helper.js'
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(rootRouter)
app.use(handlerError)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})