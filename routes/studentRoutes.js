const express = require('express');
const studentController = require('../controllers/studentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.patch('/updateProfile', restrictTo('Student'), upload.single('resume'), studentController.updateStudentProfile);
router.post('/requestMentorship', restrictTo('Student'), studentController.sendMentorshipRequest);
router.get('/myRequests', studentController.getMyMentorshipRequests);

module.exports = router;
