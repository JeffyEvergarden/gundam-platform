import MyButtonMenu from './components/div-editor-button/uploadButton';
import { Boot } from '@wangeditor/editor';
export const menu1Conf = {
  key: 'uploadOursFile', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new MyButtonMenu('uploadOursFile');
  },
};
if (!(window as any).hadRegisterMenu) {
  console.log('执行注册');
  Boot.registerMenu(menu1Conf);
  (window as any).hadRegisterMenu = true;
}

const FAQPagesHome = (props: any) => {
  return <div style={{ width: '100%', height: '100%' }}>{props.children}</div>;
};

export default FAQPagesHome;
