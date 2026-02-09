const StudentDetails = require('../models/StudentDetails');
const MentorshipRequest = require('../models/MentorshipRequest');
const AlumniDetails = require('../models/AlumniDetails');

exports.updateStudentProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.resume = req.file.path;
        }

        let details = await StudentDetails.findOne({ user: req.user.id });

        if (details) {
            details = await StudentDetails.findOneAndUpdate({ user: req.user.id }, updateData, {
                new: true,
                runValidators: true
            });
        } else {
            details = await StudentDetails.create({
                user: req.user.id,
                ...updateData
            });
        }

        res.status(200).json({
            status: 'success',
            data: { details }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.sendMentorshipRequest = async (req, res) => {
    try {
        const { alumniId, message, questions } = req.body;

        const request = await MentorshipRequest.create({
            student: req.user.id,
            alumni: alumniId,
            message,
            careerQuestions: questions
        });

        const Notification = require('../models/Notification');
        await Notification.create({
            user: alumniId,
            type: 'MENTORSHIP',
            title: 'New Mentorship Request',
            message: `${req.user.name} sent you a mentorship request.`,
            link: '/admin' // Should point to a dedicated mentorship tab in admin/alumni dashboard
        });

        res.status(201).json({
            status: 'success',
            data: { request }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMyMentorshipRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({
            $or: [{ student: req.user.id }, { alumni: req.user.id }]
        }).populate('student alumni', 'name email');

        res.status(200).json({
            status: 'success',
            data: { requests }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
