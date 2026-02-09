const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        const Notification = require('../models/Notification');
        await Notification.create({
            user: receiverId,
            type: 'MESSAGE',
            title: 'New Message',
            message: `You have a new message from ${req.user.name}`,
            link: '/messages'
        });

        res.status(201).json({
            status: 'success',
            data: { message }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getChat = async (req, res) => {
    try {
        const { otherUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        }).sort('createdAt');

        res.status(200).json({
            status: 'success',
            data: { messages }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        }).populate('sender receiver', 'name profilePhoto').sort('-createdAt');

        const conversationsMap = new Map();

        for (const msg of messages) {
            const senderId = msg.sender._id.toString();
            const receiverId = msg.receiver._id.toString();
            const otherUser = senderId === req.user.id ? msg.receiver : msg.sender;
            const otherUserId = otherUser._id.toString();

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    _id: otherUserId,
                    name: otherUser.name,
                    profilePhoto: otherUser.profilePhoto,
                    unreadCount: 0,
                    lastMessage: msg.content,
                    lastMessageAt: msg.createdAt
                });
            }

            if (receiverId === req.user.id && !msg.read) {
                conversationsMap.get(otherUserId).unreadCount += 1;
            }
        }

        const conversations = Array.from(conversationsMap.values()).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

        res.status(200).json({
            status: 'success',
            data: { conversations }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Message.updateMany(
            { sender: req.params.otherUserId, receiver: req.user.id, read: false },
            { read: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Messages marked as read'
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
