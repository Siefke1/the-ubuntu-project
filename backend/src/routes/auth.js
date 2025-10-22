const express = require('express');
const router = express.Router();

// TODO: Implement authentication routes
// - POST /register
// - POST /login
// - POST /logout
// - GET /profile
// - PUT /profile

router.get('/', (req, res) => {
  res.json({ message: 'Auth routes - coming soon!' });
});

module.exports = router;
