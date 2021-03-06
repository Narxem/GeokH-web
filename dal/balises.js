var models  = require('../models/index');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {

    models.Balise.create({
        nom: req.body.nom,
        indice: req.body.indice,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        UserId : req.session.sid,
        public: req.body.mode_balise
    }).then(function() {
        res.redirect('/Balises/view');
    });
});


router.get('/destroy/:Balise_id', function(req, res) {
    models.Balise.findOne({
        where: { id: req.params.Balise_id }
    }).then(
    function(balise) {
        if (!req.session.admin && req.session.sid != balise.UserId) {
                res.render('error', {
                    message: "Attention, vous n'avez pas le droit de supprimer la balise.",
                    error: "Accès refusé"
                });
        }
        else {
            models.Ptobq.findAll({
                where: { BaliseId: req.params.Balise_id,
                         ParcourId: {
                               $ne: null
                           }
                       }
            }).then(
            function(ents) {
                if (ents.length > 0) {
                    models.Balise.findOne({
                        where: { id: req.params.Balise_id }
                    }).then(
                    function(balise) {
                        res.render('balises_detail', {
                            balise: balise,
                            err: "Vous ne pouvez pas supprimer cette balise car elle est associée à des parcours"
                        });
                    });
                }
                else {
                    models.Balise.destroy({
                        where: { id: req.params.Balise_id }
                    }).then(
                    function() {
                        models.Balise.destroy({
                            where: { id: req.params.Balise_id }
                        }).then(
                        function() {
                            if(!req.session.admin){
                                models.Balise.findAll({
                                    where: {
                                        $or : [
                                        {UserId : req.session.sid},
                                        {public : true}
                                        ]
                                    }
                                }).then(
                                function(balises) {
                                    res.render('balises_view', {
                                        balises: balises,
                                        ok: "La balise a correctement été supprimée"
                                    });
                                });
                            }
                             else{
                                models.Balise.findAll().then(
                                function(balises) {
                                    res.render('balises_view', {
                                        balises: balises,
                                        ok: "La balise a correctement été supprimée"
                                    });
                                });
                             }
                        });
                    });
                }
            });

        }
    });
});

router.post('/update/:Balise_id', function(req, res) {

    models.Balise.update({
        nom: req.body.nom,
        indice: req.body.indice,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        public: req.body.mode_balise
    },{
        where: { id : req.params.Balise_id }
    }).then(function() {
        res.redirect('/Balises/view/' + req.params.Balise_id);
    });

});

module.exports = router;
