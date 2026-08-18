const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { /* Fetch all products */ });
router.get('/:id', (req, res) => { /* Get product details */ });
router.post('/', (req, res) => { /* Add new product */ });

module.exports = router;