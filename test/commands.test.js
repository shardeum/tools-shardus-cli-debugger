const commands = require('../src/commands')
const actions = require('../src/actions')

// Mock dependencies
jest.mock('../src/actions', () => ({
  get: jest.fn(),
  collect: jest.fn(),
  combine: jest.fn(),
}))

describe('Commands Module', () => {
  let mockProg

  beforeEach(() => {
    jest.clearAllMocks()
    // Create a mock program object with command method
    mockProg = {
      command: jest.fn().mockReturnThis(),
      argument: jest.fn().mockReturnThis(),
      action: jest.fn().mockReturnThis(),
    }
  })

  describe('get command', () => {
    it('should register the get command with correct arguments', () => {
      // Execute
      commands.get(mockProg, '')

      // Assert
      expect(mockProg.command).toHaveBeenCalledWith('get', 'Get debug data for the given instance')
      expect(mockProg.argument).toHaveBeenCalledWith('<instanceUrl>', 'URL of the instance to download debug data from')
      expect(mockProg.argument).toHaveBeenCalledWith(
        '[instanceDir]',
        'Path to unpack the instances debug data into. Unpacks into current path if not given'
      )
      expect(mockProg.action).toHaveBeenCalledWith(actions.get)
    })

    it('should include namespace if provided', () => {
      // Execute
      commands.get(mockProg, 'debug')

      // Assert
      expect(mockProg.command).toHaveBeenCalledWith('debug get', 'Get debug data for the given instance')
    })
  })

  describe('collect command', () => {
    it('should register the collect command with correct arguments', () => {
      // Execute
      commands.collect(mockProg, '')

      // Assert
      expect(mockProg.command).toHaveBeenCalledWith('collect', 'Collect debug data of all network instances')
      expect(mockProg.argument).toHaveBeenCalledWith(
        '<instanceUrl>',
        'URL of an instance in the network to download debug info from'
      )
      expect(mockProg.argument).toHaveBeenCalledWith(
        '[networkDir]',
        'Path to put all network instances debug info into. Uses current path if not given'
      )
      expect(mockProg.action).toHaveBeenCalledWith(actions.collect)
    })
  })

  describe('combine command', () => {
    it('should register the combine command with correct arguments', () => {
      // Execute
      commands.combine(mockProg, '')

      // Assert
      expect(mockProg.command).toHaveBeenCalledWith('combine', 'Combine the logs of all instances in a test net')
      expect(mockProg.argument).toHaveBeenCalledWith(
        '<networkDir>',
        'A path containing multiple instanceDirs with logs'
      )
      expect(mockProg.action).toHaveBeenCalledWith(actions.combine)
    })
  })
})
