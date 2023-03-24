export default [
  {
    path: '/gundam/home/list',
    layout: true,
    component: './gundam/management/layout',
    name: '机器人管理',
    access: 'routerAuth',
  },
  {
    path: '/gundamPages',
    hideInMenu: true,
    layout: false,
    component: './gundam-pages',
    name: '机器人详情',
    routes: [
      {
        path: '/gundamPages/home',
        component: './home',
        name: '首页',
      },
      {
        path: '/gundamPages/detail',
        component: './gundam-pages/detail',
        name: '机器人配置',
        routes: [
          {
            path: '/gundamPages/detail/nodeConfig',
            component: './gundam-pages/detail/nodeConfig',
            name: '节点配置',
            code: 'robot_mg-global-node_conf',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/detail/globalConfig',
            component: './gundam-pages/detail/globalConfig',
            name: '变量配置',
            code: 'robot_mg-global-var_conf',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/detail/interfaceConfig',
            component: './gundam-pages/detail/interfaceConfig',
            name: '接口配置',
            code: 'robot_mg-global-inteface_conf',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/detail/FAQConfig',
            component: './gundam-pages/detail/FAQConfig',
            name: 'FAQ配置',
            code: 'robot_mg-global-faq_conf',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/detail/channelConfig',
            component: './gundam-pages/detail/channelConfig',
            name: '渠道配置',
            code: 'robot_mg-global-channel_conf',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/detail/TTSConfig',
            component: './gundam-pages/detail/TTSConfig',
            name: 'TTS配置',
            code: 'robot_mg-global-tts_conf',
            access: 'routerAuth',
          },
          { redirect: '/gundamPages/detail' },
        ],
      },
      {
        path: '/gundamPages/wish',
        component: './gundam-pages/wish/home',
        name: '意图管理',
        routes: [
          {
            path: '/gundamPages/wish/wishList',
            component: './gundam-pages/wish/wishList',
            name: '意图管理',
            code: 'robot_mg-wish-list',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/wish/ruleMould',
            component: './gundam-pages/wish/ruleMould',
            name: '规则模版',
            code: 'robot_mg-wish-list',
            access: 'routerAuth',
          },
          { redirect: '/gundamPages/wish/wishList' },
        ],
      },
      {
        path: '/gundamPages/sample',
        component: './gundam-pages/sample',
        name: '样本',
      },
      {
        path: '/gundamPages/wordSlotLibrary',
        component: './gundam-pages/word-slot-library',
        name: '词槽管理',
        code: 'robot_mg-wordslot-list',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/lexiconManage',
        component: './gundam-pages/lexicon-manage',
        name: '词库管理',
        code: 'robot_mg-word-list',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/spokenLabel',
        component: './gundam-pages/spoken-label',
        name: '话术标签管理',
        code: 'robot_mg-label-list',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/mainDraw',
        component: './gundam-pages/main-draw/layout',
        name: '主流程配置',
        // code: 'robot_mg-main_page',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/businessDraw',
        component: './gundam-pages/business-draw/layout',
        name: '业务流程管理',
        routes: [
          {
            path: '/gundamPages/businessDraw/list',
            component: './gundam-pages/business-draw',
            name: '业务流程管理',
            code: 'robot_mg-businessflow-list',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/businessDraw/detail',
            component: './gundam-pages/business-draw/pages/draw-page',
            name: '业务流程管理-详情配置',
            code: 'robot_mg-businessflow-list',
            access: 'routerAuth',
          },
          { redirect: '/gundamPages/businessDraw/list' },
        ],
      },
      {
        path: '/gundamPages/aiSimulation',
        component: './gundam-pages/ai-simulation',
        name: '机器人模拟',
      },
      // FAQ相关 -------------------------------------
      {
        path: '/gundamPages/faq*',
        component: './gundam-pages/FAQ/home',
        name: 'FAQ-标准',
        code: 'robot_mg-faq-list',
        access: 'routerAuth',
      },
      {
        path: '/gundamPages/module', // faq相关页面都整合到这里
        component: './gundam-pages/FAQ-module/home',
        name: 'FAQ管理',
        routes: [
          {
            path: '/gundamPages/module/faq/clearlist',
            component: './gundam-pages/FAQ-module/clearlist',
            name: 'FAQ-澄清',
            code: 'robot_mg-faq_clear-list',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/module/faq/blacklist',
            component: './gundam-pages/FAQ-module/blacklist',
            name: 'FAQ-黑名单',
            code: 'robot_mg-faq_black-list',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/module/faq/reviewedList',
            component: './gundam-pages/FAQ-module/reviewedList',
            name: '待审核',
            code: 'robot_mg-faq_audit-list',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/module/faq/pendingList',
            component: './gundam-pages/FAQ-module/pendingList',
            name: '待处理',
            code: 'robot_mg-faq_pending-list',
            access: 'routerAuth',
          },
        ],
      },
      {
        path: '/gundamPages/knowledgeLearn',
        component: './gundam-pages/knowledge-learn/home',
        name: '知识学习',
        routes: [
          {
            path: '/gundamPages/knowledgeLearn/unknowQuestion',
            component: './gundam-pages/knowledge-learn/unknowQuestion',
            name: '未知问题',
            code: 'robot_mg-knowledge_unknow_learn-view',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/knowledgeLearn/standardQuestionLearn',
            component: './gundam-pages/knowledge-learn/standardQuestionLearn',
            name: '标准问学习',
          },
          {
            path: '/gundamPages/knowledgeLearn/batchTest',
            component: './gundam-pages/knowledge-learn/batch-test',
            name: '批量检测',
            code: 'robot_mg-knowledge_batch_check-view',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/knowledgeLearn/batchTest/detailList',
            component: './gundam-pages/knowledge-learn/component/detail-list',
            name: '明细',
          },
          {
            path: '/gundamPages/knowledgeLearn/checkWhite',
            component: './gundam-pages/knowledge-learn/check-white',
            name: '检测白名单',
            code: 'robot_mg-knowledge_check_white_list-view',
            access: 'routerAuth',
          },
        ],
      },
      {
        path: '/gundamPages/reportForm',
        component: './gundam-pages/report-form/home',
        name: '报表管理',
        routes: [
          {
            path: '/gundamPages/reportForm/visitorsNumbers',
            component: './gundam-pages/report-form/visitorsNumbers',
            name: '访客次数统计',
            code: 'robot_mg-report_visitor_count-view',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/reportForm/visitorsSession',
            component: './gundam-pages/report-form/visitorsSession',
            name: '访客会话明细',
            code: 'robot_mg-report_visitor_session-view',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/reportForm/problemRate',
            component: './gundam-pages/report-form/problemRate',
            name: '问题匹配率统计',
            code: 'robot_mg-report_problem_match-view',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/reportForm/recommendAndClare',
            component: './gundam-pages/report-form/recommendAndClare',
            name: '推荐问和澄清统计',
            code: 'robot_mg-report_recommend_and_clarify-view',
            access: 'routerAuth',
          },
          {
            path: '/gundamPages/reportForm/searchAssocation',
            component: './gundam-pages/report-form/searchAssocation',
            name: '搜索联想统计',
            // code: 'robot_mg-report_recommend_and_clarify-view',
            // access: 'routerAuth',
          },
          {
            path: '/gundamPages/reportForm/customerTrack',
            component: './gundam-pages/report-form/customerTrack',
            name: '客户轨迹报表',
            code: 'robot_mg-report-search-customerTrack-view',
            access: 'routerAuth',
          },
        ],
      },
      {
        path: '/gundamPages/effectEvaluation',
        component: './gundam-pages/effect-evaluation/home',
        name: '效果评估',
        routes: [
          {
            path: '/gundamPages/effectEvaluation/sampleManager*',
            component: './gundam-pages/effect-evaluation/sampleManager/home',
            name: '样本管理',
            code: 'robot_mg-effect_sample_manager-view',
            access: 'routerAuth',
          },
          // {
          //   path: '/gundamPages/effectEvaluation/sampleDetail',
          //   component: './gundam-pages/effect-evaluation/component/sampleDetail',
          //   name: '样本集',
          // },
          {
            path: '/gundamPages/effectEvaluation/modelEvaluation',
            component: './gundam-pages/effect-evaluation/modelEvaluation',
            name: '模型评估',
            code: 'robot_mg-effect_model_evaluation-view',
            access: 'routerAuth',
          },
        ],
      },
      {
        path: '/gundamPages/soundRecord',
        component: './gundam-pages/sound-record',
        name: '录音管理',
        code: 'robot_mg-sound-list',
        access: 'routerAuth',
      },
      { redirect: '/gundamPages/mainDraw' },
      { component: './404' },
    ],
  },
];
