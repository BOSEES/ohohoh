var express = require("express");
var router = express.Router();

// localhost:3333/home
router.get('/', function (req, res, next) {
    res.send('HOME !')
})

// localhost:3333/home/inside
router.get('/inside', function (req, res, next) {
    res.send('HOME INSIDE!')
})

module.exports = router;