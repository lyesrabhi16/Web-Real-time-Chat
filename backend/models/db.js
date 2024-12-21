import mongoose from "mongoose";

console.log("Connecting to MongoDB...");
const db = await mongoose.connect("mongodb://localhost:27018/", {
    dbName: "RealTimeChatApp",
    auth: {
        username: "db_admin",
        password: "db_admin",
    },
    timeoutMS: 5000,
}).catch((error) => {
    console.error("Error connecting to MongoDB: ", error.message);
});

if (!db) {
    console.error("MongoDB connection failed");
    process.exit(1);
};

console.log("Connected to MongoDB");

export default db;