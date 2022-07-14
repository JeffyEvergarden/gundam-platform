export default [
  {
    path: '/gundam/home/list',
    layout: true,
    component: './gundam/management/layout',
    name: '机器人管理',
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
        redirect: '/gundamPages/mainDraw',
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
          },
          {
            path: '/gundamPages/detail/globalConfig',
            component: './gundam-pages/detail/globalConfig',
            name: '变量配置',
          },
          {
            path: '/gundamPages/detail/interfaceConfig',
            component: './gundam-pages/detail/interfaceConfig',
            name: '接口配置',
          },
          {
            path: '/gundamPages/detail/FAQConfig',
            component: './gundam-pages/detail/FAQConfig',
            name: 'FAQ配置',
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
          },
          {
            path: '/gundamPages/wish/ruleMould',
            component: './gundam-pages/wish/ruleMould',
            name: '规则模版',
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
      },
      {
        path: '/gundamPages/lexiconManage',
        component: './gundam-pages/lexicon-manage',
        name: '词库管理',
      },
      {
        path: '/gundamPages/spokenLabel',
        component: './gundam-pages/spoken-label',
        name: '话术标签管理',
      },
      {
        path: '/gundamPages/mainDraw',
        component: './gundam-pages/main-draw/layout',
        name: '主流程配置',
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
          },
          {
            path: '/gundamPages/businessDraw/detail',
            component: './gundam-pages/business-draw/pages/draw-page',
            name: '业务流程管理-详情配置',
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
          },
          {
            path: '/gundamPages/module/faq/blacklist',
            component: './gundam-pages/FAQ-module/blacklist',
            name: 'FAQ-黑名单',
          },
          {
            path: '/gundamPages/module/faq/reviewedList',
            component: './gundam-pages/FAQ-module/reviewedList',
            name: '待审核',
          },
          {
            path: '/gundamPages/module/faq/pendingList',
            component: './gundam-pages/FAQ-module/pendingList',
            name: '待验证',
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
          },
          {
            path: '/gundamPages/reportForm/visitorsSession',
            component: './gundam-pages/report-form/visitorsSession',
            name: '访客会话明细',
          },
          {
            path: '/gundamPages/reportForm/problemRate',
            component: './gundam-pages/report-form/problemRate',
            name: '问题匹配率统计',
          },
          {
            path: '/gundamPages/reportForm/recommendAndClare',
            component: './gundam-pages/report-form/recommendAndClare',
            name: '推荐问和澄清统计',
          },
        ],
      },
      { redirect: '/gundamPages/mainDraw' },
      { component: './404' },
    ],
  },
];
