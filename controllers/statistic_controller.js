var models = require("../models/models.js");

exports.load = function(req, res) {
	var numPreg = 0; // número total de preguntas
	var numComent = 0; // número total de comentarios
	var media = 0; // media de comentarios por preguntas
	var numPregCon = 0; // preguntas con comentarios
	var numPregSin = 0; //preguntas sin comentarios

	models.Quiz.findAll({include:[{model: models.Comment}]}).then
	(
		function(quizes)
		{
			numPreg = quizes.length;

			for(i in quizes)
			{
				if(quizes[i].comments.length > 0)
				{
					numComent += quizes[i].comments.length;
					numPregCon++;
				}
			}
			
			if (numPreg !=0){
				media = numComent / numPreg;
			}
			
			numPregSin = numPreg - numPregCon;

			res.render("quizes/statistics", 
			{ numPreg: numPreg, numComent: numComent,
			  media: media, numPregCon: numPregCon, 
			  numPregSin: numPregSin,
			  errors: []
			});
		}
	);
};