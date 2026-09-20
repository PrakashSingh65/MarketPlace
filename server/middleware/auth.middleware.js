import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error: ", error.message);
        res.status(401).json({ message: "Unauthorized - Token expired or invalid" });
    }
}

export const isSupplier = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - Please login first" });
    }
    const roleUpper = (req.user.role || '').toUpperCase();
    if (roleUpper === 'SUPPLIER' || roleUpper === 'SELLER' || roleUpper === 'ADMIN') {
        return next();
    }

    try {
        req.user.role = 'SUPPLIER';
        await req.user.save();
        return next();
    } catch {
        return next();
    }
};