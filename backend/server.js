import express from "express";
import dotenv from "dotenv";
import usersRouter from "./api/routes/users.routes.js";
import db from "./models/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

// Routes
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
	res.send("Server is Online");
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
