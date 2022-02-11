import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  // 拂晓蓝
  primaryColor: '#1890ff',
  navTheme: 'dark',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '',
  pwa: false,
  logo: '/logo.png',
  iconfontUrl: '',
};

export default Settings;
