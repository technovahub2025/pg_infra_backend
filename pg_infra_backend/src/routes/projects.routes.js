const express = require('express');
const {
  createProject,
  deleteProject,
  getKanbanOverview,
  getProject,
  getProjectSummary,
  listProjects,
  listProjectStages,
  exportProjects,
  reorderProjects,
  updateProject,
} = require('../controllers/project.controller');
const { getProjectDocuments } = require('../controllers/upload.controller');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/export/excel', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), exportProjects);
router.get('/kanban-overview', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), getKanbanOverview);
router.get('/', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), listProjects);
router.put('/reorder', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), reorderProjects);
router.post(
  '/',
  requireAuth,
  requireRole('superadmin', 'admin', 'project_manager'),
  body('projectName').notEmpty().trim(),
  body('clientName').notEmpty().trim(),
  validateRequest,
  createProject,
);
router.get('/:id/summary', requireAuth, requireRole('superadmin', 'admin', 'project_manager', 'employee'), getProjectSummary);
router.get('/:id/documents', requireAuth, requireRole('superadmin', 'admin', 'project_manager', 'employee'), getProjectDocuments);
router.get('/:id', requireAuth, requireRole('superadmin', 'admin', 'project_manager', 'employee'), getProject);
router.get('/:projectId/stages', requireAuth, requireRole('superadmin', 'admin', 'project_manager', 'employee'), listProjectStages);
router.put('/:id', requireAuth, requireRole('superadmin', 'admin', 'project_manager'), updateProject);
router.delete('/:id', requireAuth, requireRole('superadmin'), deleteProject);

module.exports = router;
