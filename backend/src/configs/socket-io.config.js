module.exports = {
    corsOptions: {
        origin: "*", // Hoặc domain cụ thể nếu muốn bảo mật hơn
        methods: ["GET", "POST"]
    },
    roomPrefix: "User" // Prefix để tạo room theo User ID
};