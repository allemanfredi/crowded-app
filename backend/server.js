require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/')
const cors = require('cors')
const { connectWithMongo } = require('./db')
const logger = require('./utils/logger')

const startServer = async () => {
  const app = express()

  app.use(bodyParser.json())

  app.use(cors({ origin: '*', credentials: true }))

  app.use('/', router)

  app.listen(process.env.PORT, () =>
    logger.info(`Server listening on ${process.env.PORT}!`)
  )

  await connectWithMongo()
  logger.info('Mongo DB started succesfully!')
}

startServer()
