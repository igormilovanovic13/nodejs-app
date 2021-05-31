const express = require('express');

const createComplaintController = require('../controllers/create-complaint');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-complaint/add-partner', isAuth, createComplaintController.newComplaint);

router.post('/add-complaint/ajax-partner-data', isAuth, createComplaintController.ajaxData);

router.post('/add-complaint/ajax-get-record-number', isAuth, createComplaintController.getRecordNumber);

router.post('/add-complaint/add-partner', isAuth, createComplaintController.partnerInfoHandler);

router.get('/add-complaint/battery-info-input/:partnerId', isAuth, createComplaintController.batteryInfoInput);

router.post('/add-complaint/battery-info-input', isAuth, createComplaintController.batteryInfoAdd);

router.get('/add-complaint/battery-condition', isAuth, createComplaintController.batteryConditionInput);

router.post('/add-complaint/battery-condition', isAuth, createComplaintController.batteryConditionAdd);

router.get('/add-complaint/note-and-advice', isAuth, createComplaintController.noteAndAdvice);

router.post('/add-complaint/note-and-advice', isAuth, createComplaintController.noteAndAdviceAdd);

// router.post('/complaint-decision/:complaintDecId', isAuth, createComplaintController.getComplaintDecision);

// router.post('/complaint/:complaintId', isAuth, createComplaintController.getComplaint);

module.exports = router;