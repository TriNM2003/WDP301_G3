const Redis = require("ioredis");

// Kết nối Redis
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

// Kiểm tra kết nối
redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("Error connecting to Redis", err);
});

module.exports = redisClient;
