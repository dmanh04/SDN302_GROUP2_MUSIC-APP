const { forbidden } = require("../utils/baseResponse");

module.exports = function permissionGuard(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(403).json(forbidden("Chưa xác thực người dùng"));
      }
      const userRoles = req.user.roles || [];
      const hasPermission = userRoles.some((role) =>
        allowedRoles.includes(role.toUpperCase())
      );
      if (!hasPermission) {
        return res
          .status(403)
          .json(forbidden("Bạn không có quyền truy cập tài nguyên này"));
      }
      next();
    } catch (error) {
      return res.status(403).json(forbidden("Lỗi kiểm tra quyền truy cập"));
    }
  };
};
