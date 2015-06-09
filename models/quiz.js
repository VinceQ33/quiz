
module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
	{ pregunta: Datatypes.STRING,
	  respuesta: DataTypes.STRING,
	  });
}