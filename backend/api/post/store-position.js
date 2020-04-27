const { storePosition, getPosition, updatePosition } = require('../../db/')
const logger = require('../../utils/logger')
const response = require('../../utils/response')
const { getDistance } = require('geolib')
const crypto = require('crypto')
const secret = require('../../secret')
const Errors = require('../../utils/errors')

const MINIMUN_METERS = 25

const internalHash = crypto.createHash('sha256').update(secret).digest('hex')

const storePositionService = async (_req, _res) => {
  logger.info('/positions - POST - new request')
  console.log(_req.body)

  try {
    const { latitude, longitude, uuid, hash } = _req.body

    // check message auth
    if (internalHash !== hash) {
      response(_res, 400, Errors.BAD_REQUEST)
      return
    }

    /*
     * if this uuid already exist, check that coord differ of at least 25 meters,
     * update it, (lost tracking -> no matter)
     */
    const alreadyExists = await getPosition({ uuid })

    if (alreadyExists) {
      logger.info(`/positions ${uuid} already exist`)

      const distance = getDistance(
        {
          latitude,
          longitude,
        },
        {
          latitude: alreadyExists.location.coordinates[1],
          longitude: alreadyExists.location.coordinates[0],
        }
      )
      if (distance < MINIMUN_METERS) {
        logger.info(`/positions - POST - ${uuid} is lazy`)

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
    const position = {
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      uuid,
      timestamp: new Date().getTime(),
    }

    alreadyExists
      ? await updatePosition(
          { uuid: position.uuid },
          {
            $set: {
              ...position,
            },
          }
        )
      : await storePosition(position)

    response(_res, 200, position)
  } catch (err) {
    logger.error(`/positions - Error: ${err.message}`)

    response(_res, 500, Errors.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  storePositionService,
}
