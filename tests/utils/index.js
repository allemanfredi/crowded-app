const { v4 } = require('uuid')
const secret = require('../secret')
const { storePosition, storeReport } = require('../api')
const crypto = require('crypto')

const uuidv4 = () => v4()

const hash = crypto.createHash('sha256').update(secret).digest('hex')

const mockPositions = async (
  _nId,
  _lat1,
  _lon1,
  _lat2,
  _lon2,
  _withReport = false,
  _reportValue
) => {
  for (let i = 0; i < _nId; i++) {
    const uuid = uuidv4()
    for (let j = 0; j < 1; j++) {
      const lat = (Math.random() * (_lat1 - _lat2) + _lat2).toFixed(7)
      const lon = (Math.random() * (_lon1 - _lon2) + _lon2).toFixed(7)
      const position = {
        latitude: lat,
        longitude: lon,
        uuid,
        hash,
      }
      await storePosition(position)

      if (_withReport) {
        await mokeReport(uuid, _reportValue, lat, lon)
      }
    }
  }
}

const mockReports = async (_nId, _lat1, _lon1, _lat2, _lon2, _value) => {
  for (let i = 0; i < 11; i++) {
    const uuid = uuidv4()
    for (let j = 0; j < 1; j++) {
      const lat = (Math.random() * (_lat1 - _lat2) + _lat2).toFixed(7)
      const lon = (Math.random() * (_lon1 - _lon2) + _lon2).toFixed(7)
      await mokeReport(uuid, _value, lat, lon)
    }
  }
}

const mokeReport = (_uuid, _value, _lat, _lon) =>
  storeReport({
    latitude: _lat,
    longitude: _lon,
    uuid: _uuid,
    value: _value,
    hash,
  })

module.exports = {
  mockPositions,
  mockReports,
  mokeReport,
}
