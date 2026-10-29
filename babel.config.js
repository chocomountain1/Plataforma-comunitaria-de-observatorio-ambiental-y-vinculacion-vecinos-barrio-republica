module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // El plugin de worklets habilita las animaciones de Reanimated y tiene que
    // ser siempre el ultimo de la lista.
    plugins: ['react-native-worklets/plugin'],
  };
};
