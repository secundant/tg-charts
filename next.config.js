const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withProgressBar = require('next-progressbar');
const withPlugins = require('next-compose-plugins');
const withSASS = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const { resolve } = require('path');
const { compact } = require('lodash');
const webpack = require('webpack');

const path = (...prefix) => (...paths) => resolve(...prefix, ...paths);
const root = path(__dirname);
const _next = path(root(), '.next');

module.exports = withPlugins(
  compact([
    withProgressBar,
    withCSS,
    process.env.ANALYZE && [withBundleAnalyzer, {
      analyzeServer: true,
      analyzeBrowser: true,
      bundleAnalyzerConfig: {
        server: {
          analyzerMode: 'static',
          reportFilename: _next('bundles/report.server.html')
        },
        browser: {
          analyzerMode: 'static',
          reportFilename: _next('bundles/report.client.html'),
          generateStatsFile: true,
          statsFilename: _next('bundles/stats.client.json'),
          statsOptions: 'normal'
        }
      }
    }],
    [withSASS, {
      cssModules: true
    }]
  ]),
  {
    target: 'serverless',
    webpack(config, { isServer }) {
      config.profile = true;

      config.plugins.push(new webpack.DefinePlugin({
        IS_CLIENT: `${isServer ? 'false' : 'true'}`
      }));
      return config
    }
  }
);
module.exports.target = 'serverless';
