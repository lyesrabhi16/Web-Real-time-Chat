import { verifyToken } from "../../../utils/jwt.js";

export const authenticate = (req, res, next) => {   
	const token_cookie = req.cookies?.token;
	const token_auth = req.headers?.authorization.split(" ")[1]; 
    if (!token_cookie && !token_auth) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const token = token_cookie || token_auth;

	
	const data = verifyToken(token);
	if (!data) {
        // Clear the cookie if the token is invalid
		res.cookie("token", "", {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			expires: new Date(0),
		});
		return res.status(401).json({ error: "Unauthorized" });
	}
	req.user = data;
    console.log("authenticated:", req.user.username);
	next();
};
