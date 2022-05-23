export default [
  {
    path: '/gundam',
    layout: true,
    component: '../layout',
    name: '机器人管理',
    routes: [
      {
        path: '/gundam/home/list',
        component: './gundam/management',
        name: '机器人列表',
      },
      { redirect: '/gundam/home/list' },
      { component: './404' },
    ],
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
      {
        path: '/gundamPages/faq/*',
        component: './gundam-pages/FAQ/home',
        name: 'FAQ',
        // routes: [
        //   {
        //     path: '/gundamPages/faq/main',
        //     component: './gundam-pages/FAQ/FAQ-manage',
        //     name: 'FAQ管理',
        //   },
        //   {
        //     path: '/gundamPages/faq/board',
        //     component: './gundam-pages/FAQ/question-board/layout',
        //     name: '编辑面板',
        //   },
        //   {
        //     path: '/gundamPages/faq/answer',
        //     component: './gundam-pages/FAQ/question-board/single',
        //     name: '编辑面板',
        //   },
        //   {
        //     path: '/gundamPages/faq/recycle',
        //     component: './gundam-pages/FAQ/question-recycle',
        //     name: '问题回收站',
        //   },
        //   {
        //     path: '/gundamPages/faq/import',
        //     component: './gundam-pages/FAQ/question-import',
        //     name: '问题批量导入',
        //   },
        //   {
        //     path: '/gundamPages/faq/recommend',
        //     component: './gundam-pages/FAQ/question-recommend',
        //     name: '推荐问',
        //   },
        //   { redirect: '/gundamPages/faq/main' },
        // ],
      },
      { redirect: '/gundamPages/mainDraw' },
      { component: './404' },
    ],
  },
];
