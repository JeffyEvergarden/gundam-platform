// 报表管理
export default [
  {
    label: '报表管理',
    value: 'robot_mg-report',
    code: '001-009',
    children: [
      {
        label: '访客次数统计',
        value: 'robot_mg-report_visitor_count-view',
        code: '001-009-001',
      },
      {
        label: '访客次数统计-导出',
        value: 'robot_mg-report_visitor_count-export_bt',
        code: '001-009-001-001',
      },
      {
        label: '访客会话明细',
        value: 'robot_mg-report_visitor_session-view',
        code: '001-009-002',
      },
      {
        label: '访客会话明细-导出',
        value: 'robot_mg-report_visitor_session-export_bt',
        code: '001-009-002-001',
      },
      {
        label: '问题匹配率统计',
        value: 'robot_mg-report_problem_match-view',
        code: '001-009-003',
      },
      {
        label: '问题匹配率统计-导出',
        value: 'robot_mg-report_problem_match-export_bt',
        code: '001-009-003-001',
      },
      {
        label: '推荐问和澄清统计',
        value: 'robot_mg-report_recommend_and_clarify-view',
        code: '001-009-004',
      },
      {
        label: '推荐问和澄清统计-导出',
        value: 'robot_mg-report_recommend_and_clarify-export_bt',
        code: '001-009-004-001',
      },

      {
        label: '搜索联想统计',
        value: 'robot_mg-report-search-association-view',
        code: '001-009-005',
      },
      {
        label: '搜索联想统计-导出',
        value: 'robot_mg-report-search-association-export_bt',
        code: '001-009-005-001',
      },
      {
        label: '客户轨迹报表',
        value: 'robot_mg-report-search-customerTrack-view',
        code: '001-009-006',
      },
      {
        label: '客户轨迹报表-导出',
        value: 'robot_mg-report-search-customerTrack-export_bt',
        code: '001-009-006-001',
      },
    ],
  },
];
