const { Router } = require('express');
const filmeController = require('../controllers/filmeController');
const loginRequired = require('../middleware/loginRequired');
const cultRequired = require('../middleware/cultRequired');

const router = Router();

router.post('/criar', loginRequired, cultRequired, filmeController.criar);
router.post('/assistir/:filmeId', loginRequired, filmeController.assistir);
router.post('/favoritar/:filmeId', loginRequired, filmeController.favoritar);

router.get('/filtrar', filmeController.filtrar);

router.get('/assistidos', loginRequired, filmeController.assistidos);
router.get('/favoritos', loginRequired, filmeController.favoritos);

router.get('/recomendacoes', loginRequired, filmeController.recomendacoes);

router.get('/populares', filmeController.populares);

router.post('/comentar/:filmeId', loginRequired, cultRequired, filmeController.comentar);

router.get('/:id', filmeController.buscarPorId);

module.exports = router;