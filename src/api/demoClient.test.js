import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { demoClient } from './demoClient';

describe('demoClient.apiCall', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should return data on successful call', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await demoClient.auth.me();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on network error and eventually succeed', async () => {
    const mockData = { id: 1, name: 'Test' };
    
    // First attempt fails with TypeError (network error)
    global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    // Second attempt succeeds
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const promise = demoClient.auth.me();
    
    // Wait for the first failure and the start of the timeout
    await vi.runAllTimersAsync();
    
    const result = await promise;
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('127.0.0.1:3000'), expect.anything());
  });

  it('should throw meaningful error after all retries fail', async () => {
    global.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    const promise = demoClient.auth.me();
    
    // Trigger all retries
    for (let i = 0; i < 3; i++) {
      await vi.runAllTimersAsync();
    }
    
    await expect(promise).rejects.toThrow('Không thể kết nối đến máy chủ');
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should NOT retry on 400 error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => JSON.stringify({ error: 'Invalid data' }),
    });

    const promise = demoClient.auth.updateMe({ name: '' });
    
    await expect(promise).rejects.toThrow('Invalid data');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
