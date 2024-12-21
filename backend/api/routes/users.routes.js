import { Router } from "express";
import { createUser, deleteUser, getCurrentUser, getUsers, loginUser, UserExists, logoutUser } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth/auth.js";


const router = Router();
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);
router.post("/register", createUser);
router.get("/current", authenticate, getCurrentUser);
router.get("/exists/:username", UserExists);
router.get("/", authenticate,getUsers);
router.delete("/:id", authenticate, deleteUser);

export default router;