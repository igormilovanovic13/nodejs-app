const express = require('express');

const analyticsController = require('../controllers/analytics');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/analytics', isAuth, analyticsController.getAnalyticsPage);

router.post('/analytics', isAuth, analyticsController.getSalesData);

router.post('/analytics/:pastDate', isAuth, analyticsController.getSalesDataPastYear);

module.exports = router;
