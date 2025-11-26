const express = require('express');
const {
  getRawTraffic,
  getMonthlyTraffic,
  previewRawTraffic
} = require('../controllers/trafficController');

const router = express.Router();

router.get('/traffic/raw', getRawTraffic);
router.get('/traffic/monthly', getMonthlyTraffic);
router.post('/traffic/raw/preview', previewRawTraffic);

module.exports = router;
