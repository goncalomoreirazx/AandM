import axios from 'axios';

/**
 * A utility for making API requests with built-in caching,
 * rate limiting protection, and retry functionality.
 */
class ApiService {
  constructor(baseURL, defaultCacheTime = 30) {
    this.baseURL = baseURL;
    this.defaultCacheTime = defaultCacheTime; // Cache time in minutes
    this.requestQueue = [];
    this.processing = false;
    this.rateLimitDelay = 1000; // 1 second between requests
  }

  /**
   * Fetch data with caching and retry mechanism
   * @param {string} endpoint - API endpoint
   * @param {string} cacheKey - Key for caching
   * @param {number} expiry - Cache expiry time in minutes
   * @param {Object} params - Query parameters
   * @returns {Promise<any>} - Promise resolving to the API data
   */
  async get(endpoint, cacheKey, expiry = this.defaultCacheTime, params = {}) {
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Check if cache is still valid
      if (Date.now() - timestamp < expiry * 60 * 1000) {
        return data;
      }
    }

    // Queue the request
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        endpoint,
        cacheKey,
        params,
        resolve,
        reject,
        retries: 3
      });
      
      // Start processing queue if not already processing
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the request queue with rate limiting
   */
  async processQueue() {
    if (this.requestQueue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const request = this.requestQueue.shift();

    try {
      // Make the API request
      const response = await axios.get(`${this.baseURL}${request.endpoint}`, { 
        params: request.params 
      });
      
      // Cache the response
      localStorage.setItem(request.cacheKey, JSON.stringify({
        data: response.data.data,
        timestamp: Date.now()
      }));
      
      // Resolve the promise with the data
      request.resolve(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 429 && request.retries > 0) {
        // Rate limited, push back to queue with decreased retries
        this.requestQueue.unshift({
          ...request,
          retries: request.retries - 1
        });
        
        // Increase delay on rate limit
        this.rateLimitDelay = Math.min(this.rateLimitDelay * 2, 10000); // Max 10 seconds
      } else {
        // Other error or out of retries
        request.reject(error);
      }
    }

    // Process next request after delay
    setTimeout(() => {
      this.processQueue();
    }, this.rateLimitDelay);
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('jikan_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Create and export an instance for Jikan API
const jikanApi = new ApiService('https://api.jikan.moe/v4');

export default jikanApi;