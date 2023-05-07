module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      "react-native-reanimated/plugin",
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          alias: {
            app: "./app",
            assets: "./app/assets",
            components: "./app/components",
            config: "./app/config",
            i18n: "./app/i18n",
            data: "./app/data",
            navigation: "./app/navigation",
            screens: "./app/screens",
            selectors: "./app/selectors",
            store: "./app/store",
            utils: "./app/utils",
            hooks: "./app/hooks",
            services: "./app/services",
            slice: "./app/slice",
            models: "./app/models",
          },
        },
      ],
    ],
  };
};
