const { Router } = require('express');
const { authenticate } = require('../../middlewares/auth.middleware');
const controller = require('./equipos.controller');

const router = Router();

router.get('/',    authenticate, controller.listar);
router.get('/:id', authenticate, controller.obtenerPorId);

module.exports = router;
