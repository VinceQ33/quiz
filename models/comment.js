// Definición del modelo de Comment con validación

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Comment',
		{ texto: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Fata comentario"}}
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}
	);
}