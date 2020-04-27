const { getPositions, getReports } = require('../../db/')
const logger = require('../../utils/logger')
const response = require('../../utils/response')
const groupBy = require('../../utils/group-by')
const Errors = require('../../utils/errors')

const LOOKING_RANGE = 50 // meters
const WEIGHT_REPORT = 100
const WEIGHT_POSITION = 5
const THREESHOLD_MINUTES = 30
const THREESHOLD_PERSON_LOW = 20
const THREESHOLD_PERSON_HIGHT = 40

const getResultService = async (_req, _res) => {
  const { latitude, longitude } = _req.query

  logger.info(
    `/results?latitude=${latitude}&longitude=${longitude} - GET - new request`
  )

  try {
    const positions = await getPositions(
      {
        timestamp: {
          $gt: new Date().getTime() - 1000 * 60 * THREESHOLD_MINUTES,
        },
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: LOOKING_RANGE,
          },
        },
      },
      {
        timestamp: -1,
      }
    )

    const reports = await getReports(
      {
        timestamp: {
          $gt: new Date().getTime() - 1000 * 60 * THREESHOLD_MINUTES,
        },
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: LOOKING_RANGE,
          },
        },
      },
      {
        timestamp: -1,
      }
    )

    const reportsKeysGroupedByUuid = Object.keys(groupBy(reports, 'uuid'))

    logger.info(`reports: ${reports.length}`)
    logger.info(`positions: ${positions.length}`)
    logger.info(`reportsKeysGroupedByUuid: ${reportsKeysGroupedByUuid.length}`)

    /*   A L G O R I T H M   */

    // no data
    let value = null
    if (reports.length === 0 && positions.length === 0) {
      logger.info(`result: ${value}`)
      response(_res, 200, value)
      return
    }

    // no votes but some position (< THREESHOLD_PERSON_LOW)
    if (reports.length === 0 && positions.length < THREESHOLD_PERSON_LOW) {
      logger.info(`result: ${value}  ->  not sufficent data`)
      response(_res, 200, value)
      return
    }

    // only 1 'yes' votes and 1 positions -> crowded
    if (
      reportsKeysGroupedByUuid.length === 1 &&
      positions.length === 1 &&
      reportsKeysGroupedByUuid[0].value === 1
    ) {
      logger.info(`result: 0.5  ->  1 reports with 1 position`)
      response(_res, 200, 0.5)
      return
    }

    // if there are votes but few positions (< THREESHOLD_PERSON_LOW) -> weighted average
    if (
      reportsKeysGroupedByUuid.length > 0 &&
      positions.length < THREESHOLD_PERSON_LOW &&
      majorityHasVoted(positions, reportsKeysGroupedByUuid)
    ) {
      value = weightedAverage(positions, reports)

      logger.info(`result from weighted average: ${value === 0 ? 0.01 : value}`)

      response(_res, 200, value === 0 ? 0.01 : value)
      return
    }

    // if persons are > 20 & < 40 -> and the majority has not voted (DIFFICULT TO ESTABILISH)
    if (
      positions.length >= THREESHOLD_PERSON_LOW &&
      positions.length <= THREESHOLD_PERSON_HIGHT &&
      !majorityHasVoted(positions, reportsKeysGroupedByUuid)
    ) {
      logger.info(
        'result: null -->  20 >= positions <= 40 and majority has not voted'
      )
      response(_res, 200, null)
      return
    }

    // if persons are >= 20 & =< 40 the majority has voted -> weighted average
    if (
      positions.length >= THREESHOLD_PERSON_LOW &&
      positions.length <= THREESHOLD_PERSON_HIGHT &&
      majorityHasVoted(positions, reportsKeysGroupedByUuid)
    ) {
      value = weightedAverage(positions, reports)
      logger.info(
        `result: ${value} (weighted average) -->  20 >= positions <= 40 and majority has voted`
      )
      response(_res, 200, value)
      return
    }

    // if persons are > 40 and the majority has not voted -> crowded
    if (
      positions.length > THREESHOLD_PERSON_HIGHT &&
      !majorityHasVoted(positions, reportsKeysGroupedByUuid)
    ) {
      logger.info('result: 0.5 -->  positions > 40 and majority has not voted')
      response(_res, 200, 0.5)
      return
    }

    // if persons are > 40 and the majority has voted weighted average
    if (
      positions.length > THREESHOLD_PERSON_HIGHT &&
      majorityHasVoted(positions, reportsKeysGroupedByUuid)
    ) {
      value = weightedAverage(positions, reports)
      logger.info(
        `result: ${value} (weighted average) -->  positions > 40 and majority has voted`
      )
      response(_res, 200, value)
      return
    }

    logger.info(`result: ${value}`)
    response(_res, 200, value)
  } catch (err) {
    logger.error(`/positions - Error: ${err.message}`)

    response(_res, 500, Errors.INTERNAL_SERVER_ERROR)
  }
}

/**
 *
 *  Majority (in this case) is defined as (number of positions / 3) + 1
 */
const majorityHasVoted = (_positions, _reports) =>
  _reports.length >= _positions.length / 3 + 1 ? true : false

const weightedAverage = (_positions, _reports) => {
  let sreports = 0
  _reports.forEach((report) => (sreports += report.value * WEIGHT_REPORT))

  let spositions = 0
  _positions.forEach(() => (spositions += WEIGHT_POSITION))

  return (
    (sreports + spositions) /
    (WEIGHT_REPORT * _reports.length + WEIGHT_POSITION * _positions.length)
  )
}

module.exports = {
  getResultService,
}
