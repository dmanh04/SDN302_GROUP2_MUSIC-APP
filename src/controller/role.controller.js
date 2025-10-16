const Role = require('../models/Role');

// Tạo mới Role
exports.create = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).send(role);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Lấy tất cả Roles
exports.findAll = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.status(200).send(roles);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy Role theo ID
exports.findOne = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.status(200).send(role);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cập nhật Role theo ID
exports.update = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.status(200).send(role);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Xóa Role theo ID
exports.delete = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.status(200).send({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};