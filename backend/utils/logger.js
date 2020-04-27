const winston = require('winston')
const moment = require('moment')

const myFormat = winston.format.printf((info) => {
  return `[${info.timestamp}] - ${info.level} -  ${info.message}`
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => moment().format('YYYY-MM-DD HH:mm:ss'),
        }),
        winston.format.json()
      ),
      filename: './logs/error.log',
      level: 'error',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => moment().format('YYYY-MM-DD HH:mm:ss'),
        }),
        myFormat
      ),
    }),
  ],
})

module.exports = logger
