var express = require('express');
var router = express.Router();
var request = require('request');

var bodyParser = require('body-parser');

router.get('/', function(req, res) {
    res.render('index', {
        menu: "accueil"
    });
});

router.get('/apropos/', function(req, res) {
    console.log('A propos');
    res.render('apropos', {
        menu: "apropos"
    });
});

module.exports = router;