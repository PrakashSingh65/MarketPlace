const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => { /* Register controller logic */ });
router.post('/login', (req, res) => { /* Login controller logic */ });
router.get('/me', (req, res) => { /* Current user profile */ });

module.exports = router;