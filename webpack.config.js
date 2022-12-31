const path = require('path');

module.exports = {
  mode: 'development',
  entry: './extension.js',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
  },
  externals: ['vscode']
};
