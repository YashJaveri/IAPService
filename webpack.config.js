const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: {
    server: './src/index.ts',
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        options: {
          configFile: 'tsconfig.json'
        }
      },
      {
        test: /\.s?css/,
        loader: 'ignore-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  }
};