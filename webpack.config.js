
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
    if(routeItem === 'disabled') continue;
    var entryName = routeItem.entry || routeKey;
    entry[entryName] = ['./public/views/page/' + entryName, hotMiddlewareScript];
  }
};

var entryCommon = function(name, ext){
  var filename = './page/' + name + '/index.' + ext;
  if(name === 'base'){
    filename = './common/base.' + ext;
  }
  return filename;
}

entry.base = ['./public/views/common/base.js', hotMiddlewareScript];

var devConfig = {
  mode: process.env.NODE_ENV,
  entry: entry,
  output: {
    filename: (options) => {
      return entryCommon(options.chunk.name, 'js');
    },
    path: path.resolve(__dirname, './app/public'),
    publicPath: publicPath
  },
  devtool: 'eval-source-map',

  resolve: {    
    alias: {
      public: path.resolve(__dirname, './public'),
      styles: path.resolve(__dirname, './public/styles'),
      views: path.resolve(__dirname, './public/views'),
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
      }, 
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: "css-loader",
            options: {
              minimize: true,
              sourceMap: true
            }
          }]
        })
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: path.resolve(__dirname, './postcss.config.js')
                }
              }
            }, 
            {
              loader: "sass-loader"
            }
          ]
        })
      }
    ]
  },
  externals: {
      // "react": "React",
      // "react-dom": "ReactDOM"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: (getPath) => {        
        return entryCommon(getPath('[name]'), 'css');
      },
      disable: false,
      allChunks: true
    })
  ]
};

module.exports = devConfig;
