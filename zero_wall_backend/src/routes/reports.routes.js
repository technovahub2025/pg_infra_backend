const express = require('express');
const {
  getEngineerUtilization,
  getPriorityReport,
  getProjectStatusReport,
  getRevenueTrend,
  getStageCompletion,
  getTaskStatusReport,
  reports,
} = require('../controllers/report.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), reports);
router.get('/project-status', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), getProjectStatusReport);
router.get('/priority', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), getPriorityReport);
router.get('/task-status', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), getTaskStatusReport);
router.get('/revenue-trend', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), getRevenueTrend);
router.get('/stage-completion', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), getStageCompletion);
router.get('/engineer-utilization', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), getEngineerUtilization);

module.exports = router;
