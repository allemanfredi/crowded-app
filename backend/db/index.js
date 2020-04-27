require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const logger = require('../utils/logger')

let db = null

const envType = process.argv[2]
const dbName =
  envType === 'prod' ? process.env.DB_NAME_PROD : process.env.DB_NAME_TEST

const connectWithMongo = () =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      process.env.DB_URL,
      {
        useUnifiedTopology: true,
      },
      async (err, client) => {
        if (err) reject(err)

        db = client.db(dbName)

        await createIndex('reports', { location: '2dsphere', timestamp: -1 })
        await createIndex('positions', { location: '2dsphere', timestamp: -1 })

        logger.info(`Connected to ${dbName}`)
        resolve(db)
      }
    )
  })

const _get = (_collection, _obj) =>
  new Promise((resolve, reject) => {
    const collection = db.collection(_collection)
    collection.find(_obj).toArray((err, res) => {
      if (err) reject(err)

      resolve(res[0])
    })
  })

const _getAll = (_collection, _obj, _sort = {}, _limit = 0) =>
  new Promise((resolve, reject) => {
    const collection = db.collection(_collection)
    collection
      .find(_obj)
      .sort(_sort)
      .limit(_limit)
      .toArray((err, res) => {
        if (err) reject(err)

        resolve(res)
      })
  })

const _store = (_collection, _obj) =>
  new Promise((resolve, reject) => {
    const collection = db.collection(_collection)
    collection.insertOne(_obj, (err, result) => {
      if (err) reject(err)

      resolve(result)
    })
  })

const _update = (_collection, _which, _value) =>
  new Promise((resolve, reject) => {
    const collection = db.collection(_collection)
    collection.updateOne(_which, _value, (err, result) => {
      if (err) reject(err)

      resolve(result)
    })
  })

const remove = (_collection, _obj) =>
  new Promise((resolve, reject) => {
    const collection = db.collection(_collection)
    collection.remove(_obj, (err, result) => {
      if (err) reject(err)

      resolve(result)
    })
  })

const createIndex = (_collection, _index) =>
  new Promise((resolve, reject) => {
    const collection = db.collection(_collection)
    collection.createIndex(_index, (err, result) => {
      if (err) reject(err)

      resolve(result)
    })
  })

module.exports = {
  connectWithMongo,
  getPosition: (...params) => _get('positions', ...params),
  storePosition: (...params) => _store('positions', ...params),
  updatePosition: (...params) => _update('positions', ...params),
  getPositions: (...params) => _getAll('positions', ...params),
  getReport: (...params) => _get('reports', ...params),
  storeReport: (...params) => _store('reports', ...params),
  getReports: (...params) => _getAll('reports', ...params),
  createIndex,
}
