import config from '@/config';
import {
  AudioOutlined,
  BuildOutlined,
  CrownOutlined,
  DatabaseOutlined,
  FontColorsOutlined,
  FormOutlined,
  LineChartOutlined,
  MessageOutlined,
  MonitorOutlined,
  ReadOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

export default [
  {
    icon: <CrownOutlined />,
    path: '/gundamPages/mainDraw',
    name: '主流程配置',
    code: 'robot_mg-main_page',
  },
  {
    icon: <SettingOutlined />,
    path: '/gundamPages/detail',
    name: '全局配置',
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/detail/nodeConfig',
        name: '节点配置',
        code: 'robot_mg-global-node_conf',
      },
      {
        path: '/gundamPages/detail/globalConfig',
        name: '全局变量配置',
        code: 'robot_mg-global-var_conf',
      },
      {
        path: '/gundamPages/detail/interfaceConfig',
        name: '接口配置',
        code: 'robot_mg-global-inteface_conf',
      },
      {
        path: '/gundamPages/detail/FAQConfig',
        name: 'FAQ配置',
        code: 'robot_mg-global-faq_conf',
        // hideFn: (info: any) => {
        //   return !(info?.robotType === 0 && info?.soundType === 0); // 呼入 文本
        // },
      },
      {
        path: '/gundamPages/detail/channelConfig',
        name: '渠道配置',
        code: 'robot_mg-global-channel_conf',
      },
      {
        path: '/gundamPages/detail/TTSConfig',
        name: 'TTS配置',
        code: 'robot_mg-global-tts_conf',
        hideFn: (info: any) => {
          return config.robotTypeMap[info?.robotType] === '文本'; //文本隐藏
        },
      },
    ],
  },
  {
    icon: <MonitorOutlined />,
    path: '/gundamPages/wish',
    name: '意图管理',
    code: 'robot_mg-wish-list',
  },
  {
    icon: <DatabaseOutlined />,
    path: '/gundamPages/wordSlotLibrary',
    name: '词槽管理',
    code: 'robot_mg-wordslot-list',
  },
  {
    icon: <BuildOutlined />,
    path: '/gundamPages/lexiconManage',
    name: '词库管理',
    code: 'robot_mg-word-list',
  },
  {
    icon: <FontColorsOutlined />,
    path: '/gundamPages/spokenLabel',
    name: '话术标签管理',
    code: 'robot_mg-label-list',
  },
  {
    icon: <ShareAltOutlined />,
    path: '/gundamPages/businessDraw',
    exact: true,
    _info: { fuck: true },
    name: '业务流程管理',
    code: 'robot_mg-businessflow-list',
  },
  {
    icon: <MessageOutlined />,
    path: '/gundamPages/module',
    name: 'FAQ管理',

    // hideFn: (info: any) => {
    //   return !(info?.robotType === 0 && info?.soundType === 0); // 呼入 文本
    // },
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/faq',
        name: 'FAQ-标准',
        code: 'robot_mg-faq-list',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/clearlist',
        name: 'FAQ-澄清',
        code: 'robot_mg-faq_clear-list',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/blacklist',
        name: 'FAQ-黑名单',
        code: 'robot_mg-faq_black-list',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/reviewedList',
        name: '待审核',
        code: 'robot_mg-faq_audit-list',

        showBadge: true,
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/module/faq/pendingList',
        name: '待处理',
        code: 'robot_mg-faq_pending-list',

        showBadge: true,
      },
    ],
  },
  {
    icon: <ReadOutlined />,
    path: '/gundamPages/knowledgeLearn',
    name: '知识学习',
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/knowledgeLearn/unknowQuestion',
        name: '未知问题',
        code: 'robot_mg-knowledge_unknow_learn-view',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/knowledgeLearn/batchTest',
        name: '批量检测',
        code: 'robot_mg-knowledge_batch_check-view',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/knowledgeLearn/checkWhite',
        name: '检测白名单',
        code: 'robot_mg-knowledge_check_white_list-view',
      },
    ],
  },
  {
    icon: <LineChartOutlined />,
    path: '/gundamPages/reportForm',
    name: '报表管理',

    // hideFn: (info: any) => {
    //   return !(info?.robotType === 0 && info?.soundType === 0); // 呼入 文本
    // },
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/visitorsNumbers',
        name: '访客次数统计',
        code: 'robot_mg-report_visitor_count-view',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/visitorsSession',
        name: '访客会话明细',
        code: 'robot_mg-report_visitor_session-view',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/problemRate',
        name: '问题匹配率统计',
        code: 'robot_mg-report_problem_match-view',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/recommendAndClare',
        name: '推荐问和澄清统计',
        code: 'robot_mg-report_recommend_and_clarify-view',
        hideFn: (info: any) => {
          return !(info?.robotType === 0); // 呼入 文本
        },
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/recommendAndClare',
        name: '澄清统计',
        code: 'robot_mg-report_recommend_and_clarify-view',
        hideFn: (info: any) => {
          return !(info?.robotType === 1); // 呼入 语音
        },
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/searchAssocation',
        name: '搜索联想统计',
        code: 'robot_mg-report-search-association-view',
        hideFn: (info: any) => {
          return !(info?.robotType === 0); // 呼入 文本
        },
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/customerTrack',
        name: '客户轨迹报表',
        code: 'robot_mg-report-search-customerTrack-view',
        hideFn: (info: any) => {
          return !(info?.robotType === 1); // 呼入 语音显示
        },
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/reportForm/visitorsQuestion',
        name: '访问问题统计',
        code: 'robot_mg-report-visitors_question-view',
      },
    ],
  },
  {
    icon: <FormOutlined />,
    path: '/gundamPages/effectEvaluation',
    name: '效果评估',
    routes: [
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/effectEvaluation/sampleManager',
        name: '样本管理',
        code: 'robot_mg-effect_sample_manager-view',
      },
      {
        icon: <CrownOutlined />,
        path: '/gundamPages/effectEvaluation/modelEvaluation',
        name: '模型评估',
        code: 'robot_mg-effect_model_evaluation-view',
      },
    ],
  },
  {
    icon: <AudioOutlined />,
    path: '/gundamPages/soundRecord',
    name: '录音管理',
    code: 'robot_mg-sound-list',
    hideFn: (info: any) => {
      return config.robotTypeMap[info?.robotType] === '文本'; //
    },
  },
];
