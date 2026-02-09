const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create', restrictTo('Admin'), eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.post('/register/:id', eventController.registerForEvent);

module.exports = router;
