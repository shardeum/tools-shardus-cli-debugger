const collect = require('../../src/lib/collect')
const got = require('got')
const utils = require('../../src/lib/utils')
const path = require('path')

// Mock dependencies
jest.mock('got')
jest.mock('../../src/lib/utils', () => ({
  ensureExists: jest.fn(),
  streamExtractFile: jest.fn(),
}))
jest.mock('path', () => ({
  join: jest.fn((dir, file) => `${dir}/${file}`),
}))

describe('Collect Module', () => {
  let originalConsoleLog

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock console.log
    originalConsoleLog = console.log
    console.log = jest.fn()
  })

  afterEach(() => {
    // Restore console.log
    console.log = originalConsoleLog
  })

  it('should fetch nodelist and process each node', async () => {
    // Setup
    const instanceUrl = 'localhost:8080'
    const networkDir = '/test/network'
    const progressFn = jest.fn()

    // Mock nodelist response
    got.get.mockResolvedValue({
      body: {
        nodelist: [
          { externalIp: '127.0.0.1', externalPort: 9001 },
          { externalIp: '127.0.0.1', externalPort: 9002 },
        ],
      },
    })

    // Mock successful streamExtractFile
    utils.ensureExists.mockResolvedValue(undefined)
    utils.streamExtractFile.mockResolvedValue(undefined)

    // Execute
    await collect(instanceUrl, networkDir, progressFn)

    // Assert
    expect(utils.ensureExists).toHaveBeenCalledWith(networkDir)
    expect(got.get).toHaveBeenCalledWith('http://localhost:8080/nodelist', { json: true })
    expect(utils.ensureExists).toHaveBeenCalledTimes(3) // Once for networkDir, twice for each node
    expect(utils.streamExtractFile).toHaveBeenCalledTimes(2) // Once for each node
    expect(progressFn).toHaveBeenCalledTimes(0) // Progress function is called inside streamExtractFile
  })

  it('should handle connection errors for individual nodes', async () => {
    // Setup
    const instanceUrl = 'localhost:8080'
    const networkDir = '/test/network'
    const progressFn = jest.fn()

    // Mock nodelist response
    got.get.mockResolvedValue({
      body: {
        nodelist: [
          { externalIp: '127.0.0.1', externalPort: 9001 },
          { externalIp: '127.0.0.1', externalPort: 9002 },
        ],
      },
    })

    // Mock successful ensureExists but failed streamExtractFile for the first node
    utils.ensureExists.mockResolvedValue(undefined)
    utils.streamExtractFile.mockImplementation((url) => {
      if (url.includes('9001')) {
        return Promise.reject(new Error('Connection refused'))
      }
      return Promise.resolve()
    })

    // Execute
    await collect(instanceUrl, networkDir, progressFn)

    // Assert
    expect(utils.ensureExists).toHaveBeenCalledWith(networkDir)
    expect(got.get).toHaveBeenCalledWith('http://localhost:8080/nodelist', { json: true })
    expect(utils.ensureExists).toHaveBeenCalledTimes(3) // Once for networkDir, twice for each node
    expect(utils.streamExtractFile).toHaveBeenCalledTimes(2) // Once for each node
    expect(console.log).toHaveBeenCalledWith('ERR: ', 'http://localhost:9001 Connection refused')
  })

  it('should handle non-local IP addresses', async () => {
    // Setup
    const instanceUrl = 'example.com:8080'
    const networkDir = '/test/network'
    const progressFn = jest.fn()

    // Mock nodelist response with a non-local IP
    got.get.mockResolvedValue({
      body: {
        nodelist: [{ externalIp: '192.168.1.1', externalPort: 9001 }],
      },
    })

    // Mock successful streamExtractFile
    utils.ensureExists.mockResolvedValue(undefined)
    utils.streamExtractFile.mockResolvedValue(undefined)

    // Execute
    await collect(instanceUrl, networkDir, progressFn)

    // Assert
    expect(utils.ensureExists).toHaveBeenCalledWith(networkDir)
    expect(got.get).toHaveBeenCalledWith('http://example.com:8080/nodelist', { json: true })
    expect(utils.ensureExists).toHaveBeenCalledTimes(2) // Once for networkDir, once for the node
    expect(utils.streamExtractFile).toHaveBeenCalledWith(
      'http://192.168.1.1:9001/debug',
      `${networkDir}/debug-192.168.1.1-9001`,
      expect.any(Function)
    )
  })

  it('should replace 127.0.0.1 with instanceUrl when appropriate', async () => {
    // Setup
    const instanceUrl = 'example.com:8080'
    const networkDir = '/test/network'
    const progressFn = jest.fn()

    // Mock nodelist response with localhost
    got.get.mockResolvedValue({
      body: {
        nodelist: [{ externalIp: '127.0.0.1', externalPort: 9001 }],
      },
    })

    // Mock successful streamExtractFile
    utils.ensureExists.mockResolvedValue(undefined)
    utils.streamExtractFile.mockResolvedValue(undefined)

    // Execute
    await collect(instanceUrl, networkDir, progressFn)

    // Assert
    expect(utils.ensureExists).toHaveBeenCalledWith(networkDir)
    expect(got.get).toHaveBeenCalledWith('http://example.com:8080/nodelist', { json: true })
    expect(utils.ensureExists).toHaveBeenCalledTimes(2) // Once for networkDir, once for the node
    expect(utils.streamExtractFile).toHaveBeenCalledWith(
      'http://example.com:9001/debug',
      `${networkDir}/debug-example.com-9001`,
      expect.any(Function)
    )
  })
})
