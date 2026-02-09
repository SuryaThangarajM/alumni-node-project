const User = require('../models/User');
const AlumniDetails = require('../models/AlumniDetails');
const StudentDetails = require('../models/StudentDetails');
const Job = require('../models/Job');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');

exports.getSystemStats = async (req, res) => {
    try {
        const alumniCount = await User.countDocuments({ role: 'Alumni' });
        const studentCount = await User.countDocuments({ role: 'Student' });
        const eventCount = await Event.countDocuments();
        const jobCount = await Job.countDocuments();

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    alumni: alumniCount,
                    students: studentCount,
                    events: eventCount,
                    jobs: jobCount
                }
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.create({
            ...req.body,
            postedBy: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { announcement }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort('-createdAt').populate('postedBy', 'name');

        res.status(200).json({
            status: 'success',
            results: announcements.length,
            data: { announcements }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getUnverifiedAlumni = async (req, res) => {
    try {
        const unverified = await User.find({ role: 'Alumni', isVerified: false });
        res.status(200).json({ status: 'success', data: { users: unverified } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.approveAlumni = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
