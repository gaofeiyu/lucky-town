
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;

var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    app1: ['./public/src/app.tsx', hotMiddlewareScript]
  },
  output: {
    filename: './[name]/bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: publicPath
  },
  devtool: 'eval-source-map',

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
      }, {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      }
    ]
  },
  externals: {
      "react": "React",
      "react-dom": "ReactDOM"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

module.exports = devConfig;
