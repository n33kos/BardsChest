var path = require('path');
var webpack = require('webpack');

module.exports = [
  {
      entry: './src/heartstring.js',
      mode: 'production',
      module: {
          rules : [
              {
                  test: /\.js$/,
                  loader: 'babel-loader',
                  query: {
                      presets: ['es2015']
                  }
              }
          ]
      },
      output: {
          path: path.resolve(__dirname, 'dist'),
          filename: `heartstring.min.js`,
          library: 'heartstring',
          libraryTarget: 'umd',
          umdNamedDefine: true
      },
      stats: {
          colors: true
      },
      target: 'web',
  },
];
