
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;

var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var routeConfig = require('./routeConfig');

/**
* 动态查找所有入口文件
*/
// var glob = require('glob');
// var files = glob.sync('./public/views/page/*/index.js');
// var newEntries = {};

// files.forEach(function(f){
//    var name = /.\/public\/views\/page\/*\/(.*?)\/index\.js/.exec(f)[1];//得到apps/question/index这样的文件名
//    newEntries[name] = [f,hotMiddlewareScript];
// });

var entry = {};
for(var routeKey in routeConfig){
  if(routeConfig.hasOwnProperty(routeKey)){
    var routeItem = routeConfig[routeKey];
    var entryName = routeItem.entry || routeKey;
    entry[entryName] = ['./public/views/page/' + entryName, hotMiddlewareScript];
  }
}

var devConfig = {
  mode: process.env.NODE_ENV,
  entry: entry,
  output: {
    filename: './view_module/[name].js',
    path: path.resolve(__dirname, './app/assets/js/scripts'),
    publicPath: publicPath
  },
  devtool: 'eval-source-map',

  resolve: {    
    alias: {
      public: path.resolve(__dirname, './public')
    },
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.(js|tsx)?$/,
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
      // "react": "React",
      // "react-dom": "ReactDOM"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

module.exports = devConfig;
