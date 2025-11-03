const Account = require("../models/account.model");
const bcrypt = require("bcryptjs");
const { ok, created, badRequest, notFound, internalError } = require("../utils/baseResponse");

/**
 * [GET] /accounts
 */
exports.getAll = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate("roles", "name")
      .select("-password_hash");
    return res.json(ok(accounts));
  } catch (error) {
    return res.status(500).json(internalError(error.message));
  }
};

/**
 * [GET] /accounts/:id
 */
exports.getById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .populate("roles", "name")
      .select("-password_hash");
    if (!account) return res.status(404).json(notFound("Không tìm thấy tài khoản"));

    return res.json(ok(account));
  } catch (error) {
    return res.status(500).json(internalError(error.message));
  }
};

/**
 * [POST] /accounts
 */
exports.create = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    const exists = await Account.findOne({ email });
    if (exists) return res.status(400).json(badRequest("Email đã tồn tại trong hệ thống"));

    const hashed = await bcrypt.hash(password, 10);

    const newAccount = new Account({
      email,
      password_hash: hashed,
      roles: roles || [],
      active: true,
    });

    await newAccount.save();
    await newAccount.populate("roles", "name");

    const formatted = {
      _id: newAccount._id,
      email: newAccount.email,
      avatar: newAccount.avatar,
      roles: newAccount.roles.map((r) => r.name),
    };

    return res.status(201).json(created(formatted));
  } catch (error) {
    return res.status(500).json(internalError(error.message));
  }
};

/**
 * [PUT] /accounts/:id
 */
exports.update = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json(notFound("Không tìm thấy tài khoản"));

    const updates = { ...req.body };
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .populate("roles", "name")
      .select("-password_hash");

    return res.json(ok(updatedAccount));
  } catch (error) {
    return res.status(500).json(internalError(error.message));
  }
};

/**
 * [DELETE] /accounts/:id
 */
exports.remove = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json(notFound("Không tìm thấy tài khoản"));

    return res.json(ok({ message: "Xóa tài khoản thành công" }));
  } catch (error) {
    return res.status(500).json(internalError(error.message));
  }
};
