const fs = require('fs');
const path = require('path');
const { ensureExists, streamExtractFile } = require('../../src/lib/utils');

// Mock dependencies
jest.mock('fs');
jest.mock('got');
jest.mock('tar');

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureExists', () => {
    it('should create directory if it does not exist', async () => {
      // Mock fs.mkdir to simulate successful directory creation
      fs.mkdir.mockImplementation((dir, options, callback) => {
        callback(null);
      });

      await expect(ensureExists('/test/dir')).resolves.toBeUndefined();
      expect(fs.mkdir).toHaveBeenCalledWith('/test/dir', { recursive: true }, expect.any(Function));
    });

    it('should resolve if directory already exists', async () => {
      // Mock fs.mkdir to simulate directory already exists
      fs.mkdir.mockImplementation((dir, options, callback) => {
        const error = new Error('Directory exists');
        error.code = 'EEXIST';
        callback(error);
      });

      await expect(ensureExists('/test/dir')).resolves.toBeUndefined();
      expect(fs.mkdir).toHaveBeenCalledWith('/test/dir', { recursive: true }, expect.any(Function));
    });

    it('should reject if an error occurs', async () => {
      // Mock fs.mkdir to simulate an error
      const mockError = new Error('Some error');
      fs.mkdir.mockImplementation((dir, options, callback) => {
        callback(mockError);
      });

      await expect(ensureExists('/test/dir')).rejects.toEqual(mockError);
      expect(fs.mkdir).toHaveBeenCalledWith('/test/dir', { recursive: true }, expect.any(Function));
    });
  });

  // Note: streamExtractFile is more complex to test due to event handling
  // This is a simplified test that verifies the function exists
  describe('streamExtractFile', () => {
    it('should be a function', () => {
      expect(typeof streamExtractFile).toBe('function');
    });
  });
}); 