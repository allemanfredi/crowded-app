import axios from 'axios'
import settings from '../settings'

const API = axios.create({
  baseURL: settings.baseUrl,
  timeout: settings.timeout,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Origin, Content-Type',
    'Content-Type': 'application/json',
  },
})

const makeApiCall = (_callType, _apiPath, _params = null) =>
  new Promise((resolve, reject) => {
    API[_callType.toLowerCase()](_apiPath, _params)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response ? err.response.data : err.message))
  })

const getResult = (_lat, _long) =>
  makeApiCall('GET', `/results?latitude=${_lat}&longitude=${_long}`)
const storePosition = (_position) =>
  makeApiCall('POST', '/positions', _position)
const storeReport = (_report) => makeApiCall('POST', '/reports', _report)

export { storePosition, storeReport, getResult }
