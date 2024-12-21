import jwt from "jsonwebtoken";

export const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};