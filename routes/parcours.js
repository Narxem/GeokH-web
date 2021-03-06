var express = require('express');
var router = express.Router();
var request = require('request');
var models  = require('../models/index');
var sequelize = require('sequelize');
var bodyParser = require('body-parser');

// VIEW ALL > GET
router.get('/view/', function(req, res) {
    if(!req.session.admin){
        models.Parcours.findAll({
            where: {
                $or : [
                {UserId : req.session.sid},
                {public : true}
                ]
            },
            include: [ models.User ]
        }).then(
            function(parcours) {
                res.render('parcours_view', {
                    parcours: parcours
                });
            });
    }else{
        models.Parcours.findAll({
        include: [ models.User ]
        }).then(
        function(parcours) {
            res.render('parcours_view', {
                parcours: parcours
            });
        });
    }
});

// VIEW ONE > GET
router.get('/view/:id', function(req, res) {

    models.Parcours.findOne({
            where: { id: req.params.id }
        }).then(
            function(parcours) {
                res.render('parcours_detail', {
                    parcours: parcours
                });
            });

});

// CREATE > GET
router.get('/create/', function(req, res) {
    models.Theme.findAll().then(
        function(themes) {
            res.render('parcours_create', {themes: themes});
            console.log(parcours);
        });
});

// EDIT > GET
router.get('/edit/:id', function(req, res) {
    models.Parcours.findOne({
        where: { id: req.params.id }
    }).then(
        function(parcour) {
            if(!req.session.admin && parcour.UserId != req.session.sid){
                models.Parcours.findAll({
                    where: {
                    $or : [
                    {UserId : req.session.sid},
                    {public : true}
                    ]
                }}).then(
                function(balises) {
                    res.render('balises_view', {
                     balises: balises,
                     err : "Attention : Vous n'avez pas le droit de modifier le parcours !"
                    });
                });
            }else{
                res.render('parcours_edit', {
                    parcour: parcour
                });
            }
        });
});

module.exports = router;
