const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// General view access
router.get('/announcements', adminController.getAllAnnouncements);

// Protected flows
router.use(protect);

// Admin specific
router.get('/stats', restrictTo('Admin'), adminController.getSystemStats);
router.post('/announcements', restrictTo('Admin'), adminController.createAnnouncement);
router.get('/unverified-alumni', restrictTo('Admin'), adminController.getUnverifiedAlumni);
router.patch('/approve-alumni/:id', restrictTo('Admin'), adminController.approveAlumni);

module.exports = router;
