const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    alumni: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String,
        required: [true, 'Please include a message for your request']
    },
    careerQuestions: [String]
}, {
    timestamps: true
});

const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);

module.exports = MentorshipRequest;
