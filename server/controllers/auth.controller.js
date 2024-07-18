const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await userModel.findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }
        const newUser = new userModel({
            name,
            email,
            password
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        return res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) throw err;
            return res.status(200).json({
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
}