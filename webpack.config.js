const path = require('path');

module.exports = {
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: './', // устанавливаем относительный путь
		filename: 'bundle.js'
	},
};