const jwt = require("jsonwebtoken");
const { unauthorized, forbidden } = require("../utils/baseResponse");

module.exports = function authGuard(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(unauthorized("Unauthorized"));
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json(unauthorized("Unauthorized"));
  }
};
