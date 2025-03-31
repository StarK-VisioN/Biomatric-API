// userController.js - placeholder content
const User = require('../models/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

const addUser = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
};

module.exports = { getAllUsers, addUser };
