import * as path from 'path';
import * as webpack from 'webpack';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './server/public'),
    publicPath: './',
  },
} as webpack.Configuration);

export default config;
