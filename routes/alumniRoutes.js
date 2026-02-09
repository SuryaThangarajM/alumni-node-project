const express = require('express');
const alumniController = require('../controllers/alumniController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

// Alumni only
router.patch('/updateProfile', restrictTo('Alumni'), upload.single('profilePhoto'), alumniController.updateAlumniProfile);

// Admin only
router.patch('/approve/:id', restrictTo('Admin'), alumniController.approveAlumni);

// General (Students/Alumni/Admin can view)
router.get('/', alumniController.getAllAlumni);

module.exports = router;
