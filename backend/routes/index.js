const express = require('express')
const { storePositionService } = require('./../api/post/store-position')
const { storeReportService } = require('./../api/post/store-report')
const { getResultService } = require('./../api/get/result')

const router = express.Router()

router.post('/api/positions', storePositionService)
router.post('/api/reports', storeReportService)
router.get('/api/results', getResultService)

module.exports = router
