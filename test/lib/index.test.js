const lib = require('../../src/lib')
const get = require('../../src/lib/get')
const collect = require('../../src/lib/collect')
const combine = require('../../src/lib/combine')

describe('Lib Index Module', () => {
  it('should export the correct modules', () => {
    expect(lib.get).toBe(get)
    expect(lib.collect).toBe(collect)
    expect(lib.combine).toBe(combine)
  })
})
