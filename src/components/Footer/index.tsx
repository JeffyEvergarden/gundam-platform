import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const defaultMessage = '中邮消费金融数据分析团队';
  const currentYear = new Date().getFullYear();
  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} links={[]} />;
};
