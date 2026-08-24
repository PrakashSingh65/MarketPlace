import jwt from 'jsonwebtoken';

const normalizeUser = (decoded) => {
  const userId = decoded?.userId || decoded?._id || decoded?.id;

  return {
    ...decoded,
    _id: userId,
    id: userId,
    userId
  };
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const fallbackToken = req.headers['x-auth-token'] || req.headers['token'];
    const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : fallbackToken;

    if (!rawToken) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);

    req.user = normalizeUser(decoded);
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized access for this role.' });
    }
    next();
  };
};

export { verifyToken, checkRole };
export default verifyToken;