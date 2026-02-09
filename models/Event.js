const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Event description is required']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    venue: {
        type: String,
        required: [true, 'Event venue is required']
    },
    type: {
        type: String,
        enum: ['Alumni Meet', 'Webinar', 'Workshop', 'Seminar'],
        required: true
    },
    attendees: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
