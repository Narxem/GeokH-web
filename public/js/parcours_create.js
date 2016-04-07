$( document ).ready(function() {
    var detail = false;
    var edit = false;
    var create = false;
    // DETAIL
    if(document.location.href.indexOf("view")> -1)
        detail = true;
    // EDIT
    if(document.location.href.indexOf("edit")> -1)
        edit = true;
    // CREATE
    if(document.location.href.indexOf("create")> -1)
        create = true;

//////// TRAITEMENT DES DONNEES/////

    var nb_entrepreneur = 1;
    var nb_balise_question = 1;
    var entrepreneurs_add = [];
    var balise_add = [];
    var question_add = [];
    var idparcour;

    if(detail || edit)
    {
        idparcour = $("#pId").val();
        // PTOES
        $.getJSON("/api/ptoes/parcour/"+idparcour, function(result) {
            $.each(result, function(item) {
                var t = ''+
                '<tr id='+nb_entrepreneur+'>'+
                '<td>'+nb_entrepreneur+' <input type="hidden" name="entrepreneurId" value="'+result[item].Entrepreneur.id+'" /> </td>' +
                '<td>'+
                '<a href="/entrepreneurs/view/'+result[item].Entrepreneur.id+'">'+result[item].Entrepreneur.nom+'</a>'+
                '</td>';
                if(edit)
                   t+= '<td><button type="button" name="supEnt" id="supEnt" value="supprimer" /></td>';
                t += '</tr>';
                $('#tabPtoe').append(t);
                 nb_entrepreneur++
            });
        }).done(function( data ){
            for(var i=0; i<data.length;i++){
                entrepreneurs_add.push(data[i].Entrepreneur.id)
            }
        });

        // PTOBQS
        $.getJSON("/api/ptobqs/parcour/"+idparcour, function(result) {
            $.each(result, function(item) {
                 var t = ''+
                 '<tr id='+nb_balise_question+' >'+
                 '<td>'+nb_balise_question+'</td>'+
                 '<td>'+
                 '<a href="/balises/view/'+result[item].Balise.id+'">'+result[item].Balise.nom+' </a> <input type="hidden" name="baliseId" value="'+result[item].Balise.id+'" />'+
                 '</td>'+
                 '<td>'+
                 '<a href="/questions/view/'+result[item].Question.id+'">'+result[item].Question.question+'</a> <input type="hidden" name="questionId" value="'+result[item].Question.id+'" />'+
                 '</td>'+
                 '<td>'+result[item].ordre+'</td>';
                if(edit)
                    t+= '<td><button type="button" name="supBQ" id="supBQ" value="supprimer" ></td>';
                t += '</tr>';
                 $('#tabPtobq').append(t);
                 nb_balise_question++
            });
        }).done(function( data ){
          for(var i=0; i<data.length;i++){
              balise_add.push(data[i].Balise.id)
              question_add.push(data[i].Question.id)
          }
        });;

    }
    if(create || edit)
    {
        // Chargement des donn�es
        var entrepreneurs = null;
        $.getJSON("/api/entrepreneurs/", function(result) {
           var options = $("#optEnt");
           $.each(result, function(item) {
               options.append($("<option />").val(result[item].id).text(result[item].nom));
           });
        }).done(function( data ) {
            entrepreneurs = data
        });

        var balises = null;
        $.getJSON("/api/balises/", function(result) {
            var options = $("#optb");
            $.each(result, function(item) {
                options.append($("<option />").val(result[item].id).text(result[item].nom));
            });
        }).done(function( data ) {
            balises = data
        });

        var questions = null ;
        $.getJSON("/api/questions/", function(result) {
            var options = $("#optq");
            var ordre = $("#ordre");
            var i = 1;
            $.each(result, function(item) {
                options.append($("<option />").val(result[item].id).text(result[item].question));
                ordre.append($("<option />").val(i).text('Ordre ' + i));
                i++
            });
        }).done(function( data ) {
            questions = data
        });

        // Traitement des donn�es
        $("#addEnt").click(function(){
            var ent = recupererEntrepreneur($("#optEnt").val());
            if(ent == null)
                alert("L'entrepreneur utilis� n'existe pas !");
            else if($.inArray(ent.id, entrepreneurs_add) == -1){

                var t = "" +
                "<tr >"+
                    "<td> "+ nb_entrepreneur +" <input type='hidden' name='entrepreneurId' value='"+ent.id+"' /> </td>"  +
                    "<td> "+
                    "<a href='/entrepreneurs/view/"+ent.id+"' >" + ent.nom + " </a> "+
                    "</td>"+
                "</tr>";
                $("#tabPtoe").append(t);
                nb_entrepreneur++;
                entrepreneurs_add.push(ent.id);
            }else{
                alert("Entrepreneur d�j� pr�sent dans le tableau !");
            }
        });

        $('#addbq').click(function(){
            var b = recupererBalise($("#optb").val());
            var q = recupererQuestion($("#optq").val());
            var ordre = $("#ordre").val();

            if(b == null || q == null )
                alert("La Balise ou Question utilis� n'existe pas ! ");
            else if($.inArray(b.id, balise_add) != -1)
                alert("Balise d�j� utilis� ! ");
            else if($.inArray(q.id, question_add) != -1)
                alert("Question d�j� utilis� ! ");
            else{
                $("#tabPtobq").append(""+
                "<tr >"+
                "<td> "+ nb_balise_question +"</td>"  +
                "<td> <a href='/balises/view/"+b.id+"' >"+b.nom+"</a> <input type='hidden' name='baliseId' value='"+b.id+"' /> </td>" +
                "<td> <a href='/questions/view/"+q.id+"' >"+q.question+"</a> <input type='hidden' name='questionId' value='"+q.id+"' /> </td>" +
                "<td> "+ ordre +" <input type='hidden' name='ordre' value='"+ordre+"' /></td>" +
                "</tr>"
                );
                nb_balise_question++;
                balise_add.push(b.id);
                question_add.push(q.id);
            }
        });

        // R�cup�ration des donn�es d�j� pr�sentes

        function recupererEntrepreneur(id){
            for(var i= 0; i < entrepreneurs.length; i++)
            {
                if(entrepreneurs[i].id == id)
                    return entrepreneurs[i];
            }
            return null;
        }
        function recupererBalise(id){
            for(var i= 0; i < balises.length; i++)
            {
                if(balises[i].id == id)
                    return balises[i];
            }
            return null;
        }
        function recupererQuestion(id){
            for(var i= 0; i < questions.length; i++)
            {
                if(questions[i].id == id)
                    return questions[i];
            }
            return null;
        }
    }
    // Suppression des lignes du tableau
    if(edit){
        alert("special edit")
        $("#supEnt").click(function(e){
            // tr
           console.log(e.target.parentNode.parentNode);
        });
    }
});

