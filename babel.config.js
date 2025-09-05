module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '@app/app': './app',
          '@app/e2e': './e2e',
        },
      },
    ],
  ],
};
