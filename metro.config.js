const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // @expo/metro-config sets this internally but Metro validation warns about it
  if (config.watcher) {
    delete config.watcher.unstable_workerThreads;
  }

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return config;
})(); 