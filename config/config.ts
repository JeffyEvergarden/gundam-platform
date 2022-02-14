// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import CompressionPlugin from 'compression-webpack-plugin';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV, UMI_ENV } = process.env;
// 增加环境参数
console.log('打包参数 UMI_ENV: ' + UMI_ENV);
console.log('REACT_APP_ENV: ' + REACT_APP_ENV);
console.log('process.env.NODE_ENV:' + process.env.NODE_ENV);

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  publicPath: '/gundam/',
  outputPath: 'dist/',
  base: '/gundam',
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },

  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  extraBabelPlugins: isProd ? ['transform-remove-console'] : [],

  // 开启gzip压缩
  chainWebpack: function (config: any) {
    if (isProd) {
      // Gzip压缩
      config.plugin('compression-webpack-plugin').use(CompressionPlugin, [
        {
          algorithm: 'gzip',
          test: /\.(js|css|html)$/i, // 匹配
          threshold: 10240, // 超过10k的文件压缩
          deleteOriginalAssets: false, // 不删除源文件
        },
      ]);
    }
  },
});
