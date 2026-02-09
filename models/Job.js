const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    location: String,
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        default: 'Full-time'
    },
    salaryRange: String,
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    requirements: [String],
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
