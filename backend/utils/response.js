const response = (_res, _status, _data) => {
  _res.setHeader('Access-Control-Allow-Origin', '*')
  _res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  _res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  )
  _res.setHeader('Access-Control-Allow-Credentials', true)

  _res.status(_status)
  _res.json(_data)
}

module.exports = response
