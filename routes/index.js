const express = require('express');
const router = express.Router();
const path = require('path');


// GET request for the login page
router.get('/', (req, res) => {
    // Render the login.html file from the views directory
    res.sendFile('newproject.html', { root: path.join(__dirname, '../views') });
});
module.exports = router;