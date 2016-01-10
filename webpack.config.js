/* jshint node: true */
var path = require('path');
var webpack = require('webpack');


module.exports = {
  context: path.join(__dirname),
  entry: './app/index.js',

  output: {
    path: 'build',
    publicPath: 'build/',
    filename: 'app.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ],

  node: {
		fs: 'empty'
	},

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass?outputStyle=expanded&'
        + 'includePaths[]=' + (path.resolve(__dirname, './bower_components'))
        + '&'
        + 'includePaths[]=' + (path.resolve(__dirname, './node_modules'))
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: "file-loader"
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
				test: /\.json$/,
				include: path.join(__dirname, 'node_modules', 'pixi.js'),
				loader: 'json',
			},
    ]
  }
};
