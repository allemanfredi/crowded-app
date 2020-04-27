const { mockPositions, mokeReport } = require('../utils/')
const { getResult } = require('../api/')
const { expect } = require('chai')
const { v4 } = require('uuid')

const uuidv4 = () => v4()

const CROWDED_THREESHOLD = 0.39
const VERY_CROWDED_THREESHOLD = 0.81

// NOTE: majority is (in this case) (number of positions / 3) + 1

describe('Crowded: majority = (11 person over 30)', async () => {
  it('should not be possible to estabilish a result because of no data', async () => {
    const result = await getResult(0, 0)
    expect(result).to.be.null
  })

  it('should not be possible to estabilish a result because of lack of data', async () => {
    const lat1 = 44.72102
    const lon1 = 10.11507
    const lat2 = 44.72208
    const lon2 = 10.11562
    const numberOfDevices = 10

    await mockPositions(numberOfDevices, lat1, lon1, lat2, lon2)

    const result = await getResult(lat1, lon1)
    expect(result).to.be.null
  })

  it('should be crowded because the majority has voted "yes" in 50 meters', async () => {
    const lat1 = 45.435568
    const lon1 = 9.173011
    const lat2 = 45.435168
    const lon2 = 9.173011

    // 30 positions with 6 'yes and 5 'no'
    await mockPositions(19, lat1, lon1, lat2, lon2)
    await mockPositions(6, lat1, lon1, lat2, lon2, true, 1)
    await mockPositions(5, lat1, lon1, lat2, lon2, true, 0)

    const result = await getResult(lat1, lon1)
    expect(result)
      .and.to.be.greaterThan(CROWDED_THREESHOLD)
      .and.to.be.lessThan(VERY_CROWDED_THREESHOLD)
  })

  it('should be not crowded because the majority has voted and many people say "no"', async () => {
    const lat1 = 45.437213
    const lon1 = 9.168142
    const lat2 = 45.437613
    const lon2 = 9.168142

    // 30 positions with 3 'yes' and 8 'no'
    await mockPositions(19, lat1, lon1, lat2, lon2)
    await mockPositions(3, lat1, lon1, lat2, lon2, true, 1)
    await mockPositions(8, lat1, lon1, lat2, lon2, true, 0)

    const result = await getResult(lat1, lon1)
    expect(result).and.to.be.lessThan(CROWDED_THREESHOLD)
  })

  it('should be very crowded because the majority has voted and many people say "yes"', async () => {
    const lat1 = 45.440427
    const lon1 = 9.172034
    const lat2 = 45.440827
    const lon2 = 9.172034

    // 30 positions with 9 'yes and 2 'no'
    await mockPositions(19, lat1, lon1, lat2, lon2)
    await mockPositions(9, lat1, lon1, lat2, lon2, true, 1)
    await mockPositions(2, lat1, lon1, lat2, lon2, true, 0)

    const result = await getResult(lat1, lon1)
    expect(result).and.to.be.greaterThan(VERY_CROWDED_THREESHOLD)
  })

  it('should be not possible to give a result since majority has not voted and positions are few', async () => {
    const lat1 = 45.44386
    const lon1 = 9.163644
    const lat2 = 45.44346
    const lon2 = 9.163644

    // 17 positions with 1 'yes and 1 'no'
    await mockPositions(15, lat1, lon1, lat2, lon2)
    await mockPositions(1, lat1, lon1, lat2, lon2, true, 1)
    await mockPositions(1, lat1, lon1, lat2, lon2, true, 0)

    const result = await getResult(lat1, lon1)
    expect(result).and.to.be.equal(null)
  })

  it('a single user should not vote if 5 minutes are not passed from the last vote', async () => {
    const lat = 44.72102
    const lon = 10.11507
    const expectedError = -1 // bad request

    try {
      const uuid = uuidv4()

      await mokeReport(uuid, 1, lat, lon)
      await mokeReport(uuid, 1, lat, lon)
    } catch (err) {
      const { code } = err

      expect(code).to.be.equal(expectedError)
    }
  })
})
