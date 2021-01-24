const path = require('path')

module.exports = {
  entry: { handler: path.join(__dirname, 'src', 'index') },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.bundle.js',
    library: '$',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      }
    ]
  },
  mode: 'development',
  target: 'node'
}
