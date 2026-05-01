import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create the redis client
    this.client = createClient();

    // Display any error in the console
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    // Connect to the server
    this.client.connect().catch((err) => {
      console.error('Redis connection error:', err);
    });
  }

  /**
   * Checks if the connection to Redis is successful
   * @returns {boolean}
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Gets the value of a key from Redis
   * @param {string} key 
   * @returns {Promise<string|null>}
   */
  async get(key) {
    return await this.client.get(key);
  }

  /**
   * Sets a value in Redis with an expiration
   * @param {string} key 
   * @param {string|number} value 
   * @param {number} duration Expiration in seconds
   */
  async set(key, value, duration) {
    await this.client.set(key, value, {
      EX: duration
    });
  }

  /**
   * Removes a value from Redis for a specific key
   * @param {string} key 
   */
  async del(key) {
    await this.client.del(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
