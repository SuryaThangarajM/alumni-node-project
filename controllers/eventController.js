const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create({
            ...req.body,
            createdBy: req.user.id
        });

        // In a real system, we'd notify all students/alumni. 
        // For this demo, we'll just demonstrate the hook.
        const Notification = require('../models/Notification');
        await Notification.create({
            user: req.user.id,
            type: 'EVENT',
            title: 'Event Scheduled',
            message: `Event "${event.title}" has been successfully created.`,
            link: '/events'
        });

        res.status(201).json({
            status: 'success',
            data: { event }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort('date');

        res.status(200).json({
            status: 'success',
            results: events.length,
            data: { events }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'No event found with that ID' });
        }

        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ status: 'fail', message: 'You are already registered for this event' });
        }

        event.attendees.push(req.user.id);
        await event.save();

        res.status(200).json({
            status: 'success',
            message: 'Successfully registered for the event'
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
