const express = require('express');
const jobController = require('../controllers/jobController');
const jobApplicationController = require('../controllers/jobApplicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create', restrictTo('Alumni', 'Admin'), jobController.createJob);
router.get('/', jobController.getAllJobs);

// Applications
router.post('/apply', restrictTo('Student'), jobApplicationController.applyToJob);
router.get('/my-applications', restrictTo('Student'), jobApplicationController.getMyApplications);
router.get('/:jobId/applications', restrictTo('Alumni', 'Admin'), jobApplicationController.getApplicationsForJob);

module.exports = router;
