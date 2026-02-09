const Job = require('../models/Job');
const Application = require('../models/Application');

exports.createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user.id
        });

        const Notification = require('../models/Notification');
        await Notification.create({
            user: req.user.id,
            type: 'JOB',
            title: 'Job Posted',
            message: `Your job posting for ${job.company} is now live.`,
            link: '/jobs'
        });

        res.status(201).json({
            status: 'success',
            data: { job }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name');

        res.status(200).json({
            status: 'success',
            results: jobs.length,
            data: { jobs }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
