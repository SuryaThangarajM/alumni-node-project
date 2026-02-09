const User = require('../models/User');
const AlumniDetails = require('../models/AlumniDetails');

exports.updateAlumniProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profilePhoto = req.file.path;
        }

        let details = await AlumniDetails.findOne({ user: req.user.id });

        if (details) {
            details = await AlumniDetails.findOneAndUpdate({ user: req.user.id }, updateData, {
                new: true,
                runValidators: true
            });
        } else {
            details = await AlumniDetails.create({
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

exports.getAllAlumni = async (req, res) => {
    try {
        // Filter by year, dept, company, role if provided
        const filter = {};
        if (req.query.year) filter.graduationYear = req.query.year;
        if (req.query.department) filter.department = req.query.department;
        if (req.query.company) filter.company = { $regex: req.query.company, $options: 'i' };
        if (req.query.role) filter.role = { $regex: req.query.role, $options: 'i' };

        const alumni = await AlumniDetails.find(filter).populate('user', 'name profilePhoto isApproved');

        res.status(200).json({
            status: 'success',
            results: alumni.length,
            data: { alumni }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.approveAlumni = async (req, res) => {
    try {
        const alumniUser = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, {
            new: true,
            runValidators: true
        });

        if (!alumniUser) {
            return res.status(404).json({ status: 'fail', message: 'No alumni found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: { user: alumniUser }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
