const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withProgressBar = require('next-progressbar');
const withTypescript = require('@zeit/next-typescript');
const withPlugins = require('next-compose-plugins');
const withSASS = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const { resolve } = require('path');
const { compact } = require('lodash');

const path = (...prefix) => (...paths) => resolve(...prefix, ...paths);
const root = path(__dirname);
const _next = path(root(), '.next');

module.exports = withPlugins(
  compact([
    withProgressBar,
    withTypescript,
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
    webpack(config, options) {
      // Do not run type checking twice:
      if (options.isServer) {
        const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

        config.plugins.push(new ForkTsCheckerWebpackPlugin({
          tsconfig: root('tsconfig.json'),
          watch: root('**/*.{ts,tsx}')
        }));
      }

      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.plugins) {
        config.resolve.plugins = [];
      }
      config.resolve.plugins.push(new TsconfigPathsPlugin({
        configFile: root('tsconfig.json')
      }));
      config.profile = true;

      return config
    }
  }
);
