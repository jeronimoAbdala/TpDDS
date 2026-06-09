const { Router } = require('express');
const { authenticate }  = require('../middlewares/auth.middleware');
const { requireRole }   = require('../middlewares/authorize.middleware');
const { validate }      = require('../middlewares/validate.middleware');
const controller        = require('../controllers/solicitudes.controller');

const router = Router();
const ROLES_ADMIN = ['admin', 'encargado'];

const validateCrear = ({ body: { equipoId, fechaRetiro, fechaDevolucion, motivo } }) => {
  if (!equipoId || !fechaRetiro || !fechaDevolucion || !motivo) return 'equipoId, fechaRetiro, fechaDevolucion y motivo son requeridos';
  return null;
};

router.get('/',                   authenticate, controller.listar);
router.get('/resumen',            authenticate, requireRole(...ROLES_ADMIN), controller.resumen);
router.get('/:id',                authenticate, controller.obtenerPorId);
router.get('/:id/historial',      authenticate, controller.obtenerHistorial);
router.post('/',                  authenticate, validate(validateCrear), controller.crear);
router.put('/:id',                authenticate, controller.editar);
router.patch('/:id/cancelar',     authenticate, controller.cancelar);
router.patch('/:id/aprobar',      authenticate, requireRole(...ROLES_ADMIN), controller.aprobar);
router.patch('/:id/rechazar',     authenticate, requireRole(...ROLES_ADMIN), controller.rechazar);
router.patch('/:id/devolver',     authenticate, requireRole(...ROLES_ADMIN), controller.devolver);

module.exports = router;
