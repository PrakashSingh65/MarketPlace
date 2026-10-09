export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = (req.user?.role || '').toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

    if (!req.user || !normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: insufficient permissions' 
      });
    }
    next();
  };
};