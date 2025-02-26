//Role managing middleware - Allows access to the routes only for the users with specified roles
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const role = req.user.role;
    if (allowedRoles.includes(role)) {
     
      next();
    } else {
     
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

module.exports = roleMiddleware;
