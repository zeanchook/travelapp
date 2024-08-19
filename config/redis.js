const Redis = require("ioredis");
const pool = require("./database");
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    console.log(process.env.REDIS_URL);
    return process.env.REDIS_URL;
  }

  throw new Error("REDIS_URL not defined");
};

const redisService = async (key) => {
  const cachedValue = await redis.get(key);

  if (cachedValue) {
    return JSON.parse(cachedValue);
  } else {
    const response = await pool.query(key);
    await redis.set(key, JSON.stringify(response.rows), "EX", 300);
    return JSON.parse(response.rows);
  }
};

const redis = new Redis(getRedisUrl());
module.exports = { redis, redisService };
