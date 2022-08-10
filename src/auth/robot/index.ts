import report from './report'; // 报表统计
import knowLearn from './knowLearn';

export default [
  // 主流程配置
  {
    label: '主流程配置',
    value: 'robot_mg-main_page',
    code: '001-001-001',
  },
  // 全局配置
  {
    label: '全局配置',
    value: 'robot_mg-main_page',
    code: '001-002',
    children: [
      {
        label: '节点配置',
        value: 'robot_mg-global-node_conf',
        code: '001-002-001',
      },
      {
        label: '全局变量配置',
        value: 'robot_mg-global-var_conf',
        code: '001-002-002',
      },
      {
        label: '接口配置',
        value: 'robot_mg-global-inteface_conf',
        code: '001-002-003',
      },
      {
        label: 'FAQ配置',
        value: 'robot_mg-global-faq_conf',
        code: '001-002-004',
      },
      {
        label: '渠道配置',
        value: 'robot_mg-global-channel_conf',
        code: '001-002-005',
      },
    ],
  },
  // 意图管理
  {
    label: '意图管理',
    value: 'robot_mg-wish-list',
    code: '001-003-001',
  },
  // 词槽管理
  {
    label: '词槽管理',
    value: 'robot_mg-wordslot-list',
    code: '001-004-001',
  },
  // 词库管理
  {
    label: '词库管理',
    value: 'robot_mg-word-list',
    code: '001-005-001',
  },
  // 业务流程管理
  {
    label: '业务流程管理',
    value: 'robot_mg-businessflow-list',
    code: '001-006-001',
  },
  // 话术标签管理
  {
    label: '话术标签管理',
    value: 'robot_mg-label-list',
    code: '001-007-001',
  },
  // FAQ管理
  {
    label: 'FAQ管理',
    value: 'robot_mg-faq',
    code: '001-008',
    children: [
      {
        label: 'FAQ标准',
        value: 'robot_mg-faq-list',
        code: '001-008-001',
      },
      {
        label: 'FAQ澄清',
        value: 'robot_mg-faq_clear-list',
        code: '001-008-002',
      },
      {
        label: 'FAQ黑名单',
        value: 'robot_mg-faq_black-list',
        code: '001-008-003',
      },
      {
        label: '待审核',
        value: 'robot_mg-faq_audit-list',
        code: '001-008-004',
      },
      {
        label: '待处理',
        value: 'robot_mg-faq_pending-list',
        code: '001-008-005',
      },
    ],
  },
  ...report,
  ...knowLearn,
];
