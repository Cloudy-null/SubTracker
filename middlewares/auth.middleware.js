import {JWT_SECRET} from "../config/env.js";
import jwt from 'jsonwebtoken';
import userModel from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try {
        console.log("🛡️ Authorize: checking auth header");
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            console.log("❌ No token found");
            return res.status(401).json({ message: 'Unauthorized - No token' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token decoded:", decoded);

        const user = await userModel.findById(decoded.userId);
        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ message: 'Unauthorized - No user' });
        }

        req.user = user._id;
        console.log("✅ Authorized, userId set:", req.user);
        next();
    } catch (error) {
        console.error("❌ Auth error:", error);
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};


export default authorize;