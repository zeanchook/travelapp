const Redis = require("ioredis");
const pool = require("./database");
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    console.log(process.env.REDIS_URL);
    return process.env.REDIS_URL;
  }

  throw new Error("REDIS_URL not defined");
};

const redisService = async (key, values = "", EX = 300) => {
  const query = key + values;
  const cachedValue = await redis.get(query);
  console.log("query", query);
  if (cachedValue) {
    return JSON.parse(cachedValue);
  } else {
    const response =
      values !== null ? await pool.query(key, values) : await pool.query(key);
    await redis.set(query, JSON.stringify(response.rows), "EX", EX);
    return response.rows;
  }
};

const redis = new Redis(getRedisUrl());
module.exports = { redis, redisService };
