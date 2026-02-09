const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt').limit(20);
        res.status(200).json({ status: 'success', data: { notifications } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.status(200).json({ status: 'success', message: 'Notifications marked as read' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
