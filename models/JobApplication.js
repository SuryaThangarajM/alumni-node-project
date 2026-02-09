const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String,
        required: [true, 'Please provide a resume URL or upload']
    },
    status: {
        type: String,
        enum: ['Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'],
        default: 'Applied'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
