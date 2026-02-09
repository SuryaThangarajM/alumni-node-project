const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');

exports.applyToJob = async (req, res) => {
    try {
        const { job, resumeUrl } = req.body;

        // Check if already applied
        const existing = await JobApplication.findOne({ job, student: req.user.id });
        if (existing) {
            return res.status(400).json({ status: 'fail', message: 'Already applied for this job' });
        }

        let finalResumeUrl = resumeUrl;
        if (!finalResumeUrl) {
            const StudentDetails = require('../models/StudentDetails');
            const studentDetails = await StudentDetails.findOne({ user: req.user.id });
            finalResumeUrl = studentDetails?.resume;
        }

        if (!finalResumeUrl) {
            return res.status(400).json({ status: 'fail', message: 'Please upload a resume in your profile or provide a link' });
        }

        const application = await JobApplication.create({
            job,
            student: req.user.id,
            resumeUrl: finalResumeUrl
        });

        res.status(201).json({
            status: 'success',
            data: { application }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ student: req.user.id }).populate('job');

        res.status(200).json({
            status: 'success',
            results: applications.length,
            data: { applications }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getApplicationsForJob = async (req, res) => {
    try {
        // Only the alumni who posted the job should see applications?
        // For simplicity, checking if job exists
        const applications = await JobApplication.find({ job: req.params.jobId }).populate('student', 'name email');

        res.status(200).json({
            status: 'success',
            results: applications.length,
            data: { applications }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
