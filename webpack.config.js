var path = require('path');
var webpack = require('webpack');

module.exports = [
  {
      entry: './src/bardschest.js',
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
          path: path.resolve(__dirname, 'dist/js'),
          filename: `bardschest.min.js`,
          library: 'bardschest',
          libraryTarget: 'umd',
          umdNamedDefine: true
      },
      stats: {
          colors: true
      },
      target: 'web',
  },
];
