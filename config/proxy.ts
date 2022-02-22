/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/unifyportal': {
      target: 'http://11.113.0.77:18180',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    // '/robot/': {
    //   target: 'http://10.192.174.85:9085',
    //   changeOrigin: true,
    //   pathRewrite: { '^': '' },
    // },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
