import * as path from 'path';
import * as webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config: webpack.Configuration = {
  entry: {
    index: [path.resolve(__dirname, './src/scripts/entry.ts')],
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              allowTsInNodeModules: true,
              appendTsSuffixTo: [/\.vue$/],
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        oneOf: [
          // vueから呼ばれる場合
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader'],
          },
          // その他（htmlWebpackPluginからなど）
          {
            use: [{
              loader: 'pug-loader',
              options: {
                pretty: true,
              },
            }],
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/pug/index.pug'),
      hash: true,
      inject: true,
    }),
    new VueLoaderPlugin(),
  ],
};

export default config;
