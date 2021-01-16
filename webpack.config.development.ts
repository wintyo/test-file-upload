import * as path from 'path';
import * as webpack from 'webpack';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './.temp'),
    publicPath: '/',
  },
  devServer: {
    contentBase: '.temp',
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
    inline: true,
    overlay: true,
    port: 9030,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
} as webpack.Configuration);

const ip = require('ip');
// @ts-ignore
console.log(`External: http://${ip.address()}:${config.devServer.port}`);

export default config;
