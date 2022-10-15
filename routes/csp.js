/**--external- */
const { Router } = require('express');

/**--internal- */
const { cspReport } = require('../controllers');

const router = Router();
router.post('/__cspreport__', cspReport);

module.exports = router;
