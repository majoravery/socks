module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          edge: '17',
          firefox: '60',
          chrome: '67',
          safari: '11.1',
          node: 'current',
        },
        useBuiltIns: 'usage',
        corejs: 2,
      },
    ],
  ];

  const plugins = [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-dynamic-import',
  ];

  return {
    presets,
    plugins
  };
}
