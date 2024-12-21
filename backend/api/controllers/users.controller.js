import exp from "constants";
import User from "../../models/user.js";
import hash, { verify } from "../../utils/hashing.js";
import { generateToken } from "../../utils/jwt.js";

export const createUser = async (req, res) => {
	const { username, password } = req.body;
	const existingUser = await User.findOne({ username }).catch((error) => {
		if (error) {
			console.log(error);
		}
	});
	if (existingUser) {
		return res.status(400).json({ error: "User already exists" });
	}
	const hashedPassword = await hash(password).catch((error) => {
		if (error) {
			return res.status(400).json({ error });
		}
	});
	const user = new User({
		username: username,
		password: hashedPassword.hash,
		salt: hashedPassword.salt,
	});

	const user_saved = await user.save().catch((error) => {
		if (error) {
			console.log(error);
		}
	});
	if (!user_saved) {
		return res.status(400).json({ error: "User could not be saved" });
	}
	return res.status(201).json({ message: "User created successfully" });
};

export const getUsers = async (req, res) => {
	const users = await User.find().catch((error) => {
		if (error) {
			return res.status(400).json({ error });
		}
	});
	return res.status(200).json({ users });
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;
	await User.findByIdAndDelete(id).catch((error) => {
		if (error) {
			return res.status(400).json({ error });
		}
	});
	return res.status(200).json({ message: "User deleted successfully" });
};

export const UserExists = async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ username }).catch((error) => {
		if (error) {
			return res.status(400).json({ error });
		}
	});
	if (user) {
		return res.status(200).json({ exists: true });
	}
	return res.status(200).json({ exists: false });
};

export const loginUser = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username }).catch((error) => {
		if (error) {
			return res.status(400).json({ error });
		}
	});
	if (!user) {
		return res.status(400).json({ error: "Invalid username or password" });
	}

	const isValid = await verify(password, user.password, user.salt).catch(
		(error) => {
			if (error) {
				return res.status(400).json({ error });
			}
		}
	);

	if (!isValid) {
		return res.status(400).json({ error: "Invalid username or password" });
	}
	const token = generateToken(user._id, user.username);
	res.cookie("token", token, {
		httpOnly: true,
		sameSite: false,
		secure: process.env.NODE_ENV === "production",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), //30 days
	});
	return res
		.status(200)
		.json({
			message: "Login successful",
			token: token,
			user: filterUserData(user),
		});
};
export const logoutUser = async (req, res) => {
	res.clearCookie("token");
	return res.status(200).json({ message: "Logout successful" });
};


export const getCurrentUser = async (req, res) => {
	const { user } = req;
	return res.status(200).json(filterUserData(user));
}


const filterUserData = (user) => {
	return {
		username: user.username,
	};
}
