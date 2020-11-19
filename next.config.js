const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const webpack = (config) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config

  // console.log('config', config);

  /**
   * Fix locales issue
   * https://github.com/moment/moment/issues/2517#issuecomment-620674018
   */
  // config.plugins.push(
  //   new MomentLocalesPlugin({
  //     localesToKeep: ['ru'],
  //   })
  // )

  // Object.assign(config, {
  //   // https://nextjs.org/docs/api-reference/next.config.js/disabling-etag-generation
  //   generateEtags: false,
  // });

  return config

  // Important: return the modified config
  // return {
  //   ...config,

  //   // https://nextjs.org/docs/api-reference/next.config.js/disabling-etag-generation
  //   generateEtags: false,
  // }
}

const config = withBundleAnalyzer({
  webpack,
})

module.exports = {
  ...config,
}
