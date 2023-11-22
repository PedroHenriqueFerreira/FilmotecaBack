const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');
const loginRequired = require('../middleware/loginRequired');
const cultRequired = require('../middleware/cultRequired');

const router = Router();

router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);
router.get('/perfil', loginRequired, usuarioController.perfil);
router.put('/atualizar', loginRequired, usuarioController.atualizar);
router.delete('/deletar', loginRequired, usuarioController.deletar);

router.post('/assinar', loginRequired, usuarioController.assinar);
router.delete('/cancelar', loginRequired, cultRequired, usuarioController.cancelar);

module.exports = router;