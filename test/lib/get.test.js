const get = require('../../src/lib/get')
const utils = require('../../src/lib/utils')

// Mock dependencies
jest.mock('../../src/lib/utils', () => ({
  ensureExists: jest.fn(),
  streamExtractFile: jest.fn(),
}))

describe('Get Module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call ensureExists with the correct directory', async () => {
    // Setup
    utils.ensureExists.mockResolvedValue(undefined)
    utils.streamExtractFile.mockResolvedValue(undefined)
    const instanceUrl = 'localhost:8080'
    const instanceDir = '/test/dir'
    const progressFn = jest.fn()

    // Execute
    await get(instanceUrl, instanceDir, progressFn)

    // Assert
    expect(utils.ensureExists).toHaveBeenCalledWith(instanceDir)
  })

  it('should call streamExtractFile with the correct parameters', async () => {
    // Setup
    utils.ensureExists.mockResolvedValue(undefined)
    utils.streamExtractFile.mockResolvedValue(undefined)
    const instanceUrl = 'localhost:8080'
    const instanceDir = '/test/dir'
    const progressFn = jest.fn()

    // Execute
    await get(instanceUrl, instanceDir, progressFn)

    // Assert
    expect(utils.streamExtractFile).toHaveBeenCalledWith(`http://${instanceUrl}/debug`, instanceDir, progressFn)
  })

  it('should throw an error if ensureExists fails', async () => {
    // Setup
    const mockError = new Error('Directory creation failed')
    utils.ensureExists.mockRejectedValue(mockError)
    const instanceUrl = 'localhost:8080'
    const instanceDir = '/test/dir'
    const progressFn = jest.fn()

    // Execute & Assert
    await expect(get(instanceUrl, instanceDir, progressFn)).rejects.toEqual(mockError)
  })

  it('should throw an error if streamExtractFile fails', async () => {
    // Setup
    utils.ensureExists.mockResolvedValue(undefined)
    const mockError = new Error('Stream extraction failed')
    utils.streamExtractFile.mockRejectedValue(mockError)
    const instanceUrl = 'localhost:8080'
    const instanceDir = '/test/dir'
    const progressFn = jest.fn()

    // Execute & Assert
    await expect(get(instanceUrl, instanceDir, progressFn)).rejects.toEqual(mockError)
  })
})
