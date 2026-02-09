const mongoose = require('mongoose');

const studentDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Student details must belong to a user']
    },
    department: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    interestAreas: [String],
    skills: [String],
    careerGoal: { type: String, trim: true },
    resume: String // URL or path
}, {
    timestamps: true
});

const StudentDetails = mongoose.model('StudentDetails', studentDetailsSchema);

module.exports = StudentDetails;
