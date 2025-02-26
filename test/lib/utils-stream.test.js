const { streamExtractFile } = require('../../src/lib/utils');
const got = require('got');
const tar = require('tar');
const path = require('path');
const EventEmitter = require('events');

// Mock dependencies
jest.mock('got');
jest.mock('tar');
jest.mock('path');

describe('Utils - streamExtractFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock path.normalize and path.relative
    path.normalize.mockImplementation(p => p);
    path.relative.mockImplementation((from, to) => to);
    
    // Create mock stream objects
    const mockDownloadStream = new EventEmitter();
    mockDownloadStream.pipe = jest.fn().mockReturnValue(mockDownloadStream);
    
    // Mock got.stream to return our mock stream
    got.stream.mockReturnValue(mockDownloadStream);
    
    // Create mock tar extract
    const mockTarExtract = new EventEmitter();
    tar.extract.mockReturnValue(mockTarExtract);
  });
  
  it('should set up the download and extraction streams correctly', () => {
    // Setup
    const url = 'http://example.com/debug';
    const savePath = '/test/dir';
    const progressFn = jest.fn();
    
    // Execute
    const promise = streamExtractFile(url, savePath, progressFn);
    
    // Assert
    expect(got.stream).toHaveBeenCalledWith(url, { decompress: false });
    expect(tar.extract).toHaveBeenCalledWith({ cwd: savePath });
    expect(got.stream().pipe).toHaveBeenCalledWith(tar.extract());
    
    // Cleanup - resolve the promise to avoid unhandled promise rejection
    got.stream().emit('close');
  });
  
  it('should call progressFn on downloadProgress events', () => {
    // Setup
    const url = 'http://example.com/debug';
    const savePath = '/test/dir';
    const progressFn = jest.fn();
    
    // Execute
    const promise = streamExtractFile(url, savePath, progressFn);
    
    // Simulate download progress event
    const progress = { transferred: 100, total: 1000, percent: 0.1 };
    got.stream().emit('downloadProgress', progress);
    
    // Assert
    expect(progressFn).toHaveBeenCalledWith({
      url,
      savePath,
      ...progress
    });
    
    // Cleanup - resolve the promise to avoid unhandled promise rejection
    got.stream().emit('close');
  });
  
  it('should resolve the promise when extraction completes', async () => {
    // Setup
    const url = 'http://example.com/debug';
    const savePath = '/test/dir';
    const progressFn = jest.fn();
    
    // Execute
    const promise = streamExtractFile(url, savePath, progressFn);
    
    // Simulate extraction completion
    tar.extract().emit('close');
    
    // Assert
    await expect(promise).resolves.toBeUndefined();
  });
  
  it('should reject the promise on download error', async () => {
    // Setup
    const url = 'http://example.com/debug';
    const savePath = '/test/dir';
    const progressFn = jest.fn();
    const error = new Error('Download failed');
    
    // Execute
    const promise = streamExtractFile(url, savePath, progressFn);
    
    // Simulate download error
    got.stream().emit('error', error);
    
    // Assert
    await expect(promise).rejects.toEqual(error);
  });
  
  it('should reject the promise on extraction error', async () => {
    // Setup
    const url = 'http://example.com/debug';
    const savePath = '/test/dir';
    const progressFn = jest.fn();
    const error = new Error('Extraction failed');
    
    // Execute
    const promise = streamExtractFile(url, savePath, progressFn);
    
    // Simulate extraction error
    tar.extract().emit('error', error);
    
    // Assert
    await expect(promise).rejects.toEqual(error);
  });
}); 