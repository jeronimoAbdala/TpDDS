const { Router } = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/authorize.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const controller = require('./solicitudes.controller');

const router = Router();

const ROLES_ADMIN = ['admin', 'encargado'];

const validateCrear = (req) => {
  const { equipoId, fechaRetiro, fechaDevolucion, motivo } = req.body;
  if (!equipoId || !fechaRetiro || !fechaDevolucion || !motivo) {
    return 'equipoId, fechaRetiro, fechaDevolucion y motivo son requeridos';
  }
  return null;
};

// GET /api/solicitudes?estado=&equipoId=&categoria=&desde=&hasta=&page=&limit=&sortBy=&order=
router.get('/',          authenticate, controller.listar);

// GET /api/solicitudes/resumen  — debe ir ANTES de /:id
router.get('/resumen',   authenticate, requireRole(...ROLES_ADMIN), controller.resumen);

router.get('/:id',          authenticate, controller.obtenerPorId);
router.get('/:id/historial', authenticate, controller.obtenerHistorial);

router.post('/',            authenticate, validate(validateCrear), controller.crear);
router.put('/:id',          authenticate, controller.editar);

router.patch('/:id/cancelar', authenticate, controller.cancelar);
router.patch('/:id/aprobar',  authenticate, requireRole(...ROLES_ADMIN), controller.aprobar);
router.patch('/:id/rechazar', authenticate, requireRole(...ROLES_ADMIN), controller.rechazar);
router.patch('/:id/devolver', authenticate, requireRole(...ROLES_ADMIN), controller.devolver);

module.exports = router;
