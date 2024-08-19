// import Redis from "ioredis"
const Redis = require("ioredis");
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    console.log(process.env.REDIS_URL);
    return process.env.REDIS_URL;
  }

  throw new Error("REDIS_URL not defined");
};

const redis = new Redis(getRedisUrl());
// export {redis}
// export const redis = new Redis(getRedisUrl())
module.exports = { redis };