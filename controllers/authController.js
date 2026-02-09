const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, adminKey } = req.body;

        // Admin Key Validation
        if (role === 'Admin') {
            if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Invalid or missing Admin Secret Key'
                });
            }
        }


        const newUser = await User.create({
            name,
            email,
            password,
            role: role || 'Student'
        });

        // Create associated details
        if (newUser.role === 'Alumni') {
            const AlumniDetails = require('../models/AlumniDetails');
            await AlumniDetails.create({
                user: newUser._id,
                department: req.body.department,
                graduationYear: req.body.graduationYear
            });
        } else if (newUser.role === 'Student') {
            const StudentDetails = require('../models/StudentDetails');
            await StudentDetails.create({
                user: newUser._id,
                department: req.body.department,
                graduationYear: req.body.graduationYear
            });
        }

        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, adminKey } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        // Admin Key Validation on Login
        if (user.role === 'Admin') {
            if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Invalid or missing Admin Secret Key for this account'
                });
            }
        }

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMe = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};

exports.updateMe = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
const crypto = require('crypto');
const tokenUtils = require('../utils/tokenUtils');

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'No user with that email address' });
        }

        const resetToken = tokenUtils.createPasswordResetToken(user);
        await user.save({ validateBeforeSave: false });

        // In a real app, send email. For now, return in response for testing.
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email (simulated)',
            resetToken
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Token is invalid or has expired' });
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
