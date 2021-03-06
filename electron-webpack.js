const { withExpoAdapter } = require('@expo/electron-adapter');

module.exports = withExpoAdapter({
  projectRoot: __dirname,
  // Provide any overrides for electron-webpack: https://github.com/electron-userland/electron-webpack/blob/master/docs/en/configuration.md
  renderer:{
    "webpackConfig": "webpack.config.js",
  },
  main:{
    "webpackConfig": "webpack.config.js",
  },
  resolve: {
    alias: {
      'victory-native': 'victory'
    }
  }
});

