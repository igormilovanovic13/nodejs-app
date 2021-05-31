const express = require('express');

const empComplaintController = require('../controllers/employee');

const isAuth = require('../middleware/is-auth');

const isAdmin = require('../middleware/is-admin');

const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
    if(req.session.isLoggedIn && req.session.isAdmin) {
        res.redirect('/for-verification');
    } else if (req.session.isLoggedIn) {
        res.redirect('/verified');
    } else {
        res.redirect('/login');
    }
});

router.get('/complaints-list', isAuth, empComplaintController.complaintsList);

router.post('/complaint-search', isAuth, empComplaintController.complaintSearch);

router.get('/for-verification', isAuth, empComplaintController.renderComplaints);

router.get('/for-verification/:recordId', isAuth, isAdmin, empComplaintController.verifyRecord);

router.get('/verified', isAuth, empComplaintController.renderVerified);

router.get('/verified/:recordId', isAuth, empComplaintController.sendToCustomer);

router.get('/remove-complaint/:recordId', isAuth, isAdmin, empComplaintController.removeComplaint);

router.post('/regenerate-pdf', isAuth, empComplaintController.regeneratePDF);

module.exports = router;
