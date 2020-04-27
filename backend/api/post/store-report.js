const { storeReport, getReports } = require('../../db/')
const logger = require('../../utils/logger')
const response = require('../../utils/response')
const crypto = require('crypto')
const secret = require('../../secret')
const Errors = require('../../utils/errors')

const MINIMUN_MINUTES = 1000 * 60 * 5 // 5 minutes

const internalHash = crypto.createHash('sha256').update(secret).digest('hex')

const storeReportService = async (_req, _res) => {
  logger.info('/reports - POST - new request')
  console.log(_req.body)

  try {
    const { latitude, longitude, uuid, hash, value } = _req.body

    // check message auth
    if (internalHash !== hash) {
      response(_res, 400, Errors.BAD_REQUEST)
      return
    }

    // get most recent report for a given uuid
    const alreadyExists = await getReports(
      {
        uuid,
      },
      {
        timestamp: -1,
      },
      1
    )

    // if are not passed 5 minutes it is not possible to submit a report
    if (alreadyExists[0]) {
      const difference = new Date().getTime() - alreadyExists[0].timestamp
      if (difference < MINIMUN_MINUTES) {
        logger.info(`/reports - POST ${uuid} is upset!`)

        response(_res, 400, Errors.BAD_REQUEST)
        return
      }
    }

    /*
     *  NOTE:
     *   not store the hash and the timestamp is taken here
     *   geohash is calculated here since an attacker (if able) could send geohash
     *   not correlated with latitude and longitude
     *
     */
    const report = {
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      uuid,
      value,
      timestamp: new Date().getTime(),
    }

    const res = await storeReport(report)

    response(_res, 200, res)
  } catch (err) {
    logger.error(`/reports - Error: ${err.message}`)

    response(_res, 500, Errors.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  storeReportService,
}
