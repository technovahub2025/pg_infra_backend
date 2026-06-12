const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth } = require('../middleware/auth.middleware');
const {
  createManualLog,
  deleteTimerLog,
  getActiveTimer,
  startTimer,
  stopTimer,
} = require('../controllers/timer.controller');
const {
  bulkDeleteTimesheets,
  bulkUpdateTimesheets,
  exportTimesheets,
  getMyTimesheets,
} = require('../controllers/timesheet.controller');

const router = express.Router();

router.get('/active', requireAuth, getActiveTimer);
router.get('/logs/mine', requireAuth, getMyTimesheets);
router.get('/logs/export', requireAuth, exportTimesheets);
router.post(
  '/start',
  requireAuth,
  body('projectId').notEmpty().trim(),
  validateRequest,
  startTimer,
);
router.put('/stop', requireAuth, stopTimer);
router.post('/manual', requireAuth, createManualLog);
router.post('/logs/bulk-update', requireAuth, bulkUpdateTimesheets);
router.post('/logs/bulk-delete', requireAuth, bulkDeleteTimesheets);
router.delete('/:id', requireAuth, deleteTimerLog);

module.exports = router;
