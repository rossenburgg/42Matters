const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/set-light-theme', isAuthenticated, themeController.setLightTheme);
router.get('/set-dark-theme', isAuthenticated, themeController.setDarkTheme);

module.exports = router;