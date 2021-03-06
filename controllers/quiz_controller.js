//GET /quizes/:id
var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{ model: models.Comment }]
	}).then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){next(error);});
}

exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: req.quiz, errors: []});
	})
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes
exports.index=function(req,res){
	if (req.query.search === undefined) {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', { quizes: quizes , errors: []});
		}).catch(function(error) { next(error); });
	} else {
		models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search.replace("+","%")+"%"]}).then(function(quizes){
			res.render('quizes/index', { quizes: quizes , errors: []});
		}).catch(function(error) { next(error); });
	}
};

//GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(//crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Otro"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//GET /quizes/create
exports.create = function(req, res){
var quiz = models.Quiz.build( req.body.quiz );

var errors = quiz.validate();//ya que el objeto errors no tiene then(
if (errors){
		var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
		res.render('quizes/new', {quiz: quiz, errors: errores});
	} else {
		quiz // save: guarda en DB campos pregunta y respuesta de quiz
		.save({fields: ["pregunta", "respuesta", "tema"]})
		.then( function(){ res.redirect('/quizes')}) ;
	}
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; //autoload de instancia de quiz
	
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
    
    // Validamos el quiz.
    var err = req.quiz.validate();
    
    if (err) {
        var i = 0;
        var errores = new Array();
        for (var theerror in err) {
            errores[i++] = {message: err[theerror]};
        }
        res.render('quizes/edit', {quiz: req.quiz, errors: errores});
    } else {
        req.quiz // Guarda los campos en la BD.
        .save( {fields: ["pregunta", "respuesta", "tema"]} )
        .then( function() { res.redirect('/quizes');});
    }
};

exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};