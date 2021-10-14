module.exports = {
  stories: [
    '../stories/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-docs',
  ],
  // presets: [path.resolve(__dirname, "./next-preset.js")],

  // ! Taken from Storybook issue workaround
  // ! See: https://github.com/storybookjs/storybook/issues/12952#issuecomment-719871776
  babel: async (options) => ({
    ...options,
    plugins: [...options.plugins, '@babel/plugin-transform-react-jsx'],
  }),
}
