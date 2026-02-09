const mongoose = require('mongoose');

const alumniDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Alumni details must belong to a user']
    },
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    salaryRange: { type: String },
    higherStudies: [{
        institution: String,
        degree: String,
        year: Number
    }],
    achievements: [String],
    contactInfo: {
        phone: String,
        linkedin: String,
        twitter: String
    },
    isMentoring: {
        type: Boolean,
        default: false
    },
    skills: [String],
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    profilePhoto: { type: String },
    department: { type: String, required: true },
    graduationYear: { type: Number, required: true }
}, {
    timestamps: true
});

const AlumniDetails = mongoose.model('AlumniDetails', alumniDetailsSchema);

module.exports = AlumniDetails;
