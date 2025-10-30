const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');
const Account = require('../models/account.model');
const Role = require('../models/role.model');
const jwt = require("jsonwebtoken");

exports.auth = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email }).populate("roles", "name");
    if (!account) {
      return res.status(400).json(badRequest("Email hoặc mật khẩu không đúng"));
    }
    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(badRequest("Email hoặc mật khẩu không đúng"));
    }
    const payload = {
      id: account._id,
      email: account.email,
      roles: account.roles.map(r => r.name)
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "7d"
    });
    return res.status(200).json(
      ok({
        token,
        account: {
          _id: account._id,
          email: account.email,
          avatar: account.avatar,
          roles: account.roles.map(r => r.name)
        }
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(internalError(error.message));
  }
};

exports.signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        const exist = await Account.exists({ email: email });
        if (exist) {
            return res.status(400).json(badRequest('Email đã tồn tại trong hệ thống'));
        }
        
        const role = await Role.findOne({ name: "ADMIN".toUpperCase() });

        const account = new Account({ 
            email: email,
            password_hash: password,
            active: true
        });
        account.roles.push(role._id);
        await account.save();
        await account.populate("roles", "name");
        
        const formattedMovie = {
            _id: account._id,
            email: account.email,
            avatar: account.avatar,
            roles: account.roles.map(r => r.name)
        };
       res.status(201).json(ok(formattedMovie));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};