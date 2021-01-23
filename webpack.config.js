const path = require('path')

module.exports = {
  entry: { handler: './src/index' },
  output: {
    path: __dirname + './dist',
    filename: 'index_bundle.js',
    library: '$',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  mode: 'development'
}
