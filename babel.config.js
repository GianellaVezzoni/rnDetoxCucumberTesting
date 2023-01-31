module.exports = api => {
  // Cache configuration is a required option
  api.cache(false);
  const presets = ['module:metro-react-native-babel-preset'];
  return {presets};
};
