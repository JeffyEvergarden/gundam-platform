const req = {
  // ------
  robotId: '100', // 机器人ID
  flowId: '100', // 流程id
  id: '02', // 节点ID
  nodeType: 0, // 节点类型
  // 词槽 (待商定)
  nodeSlots: [
    {
      slotDesc: '1',
      slotId: '011',
      slotName: '123',
      textLabels: [],
      endText: '1213',
      required: true,
      clearText: [{ actionText: 'helloworld', textLabels: [] }],
    },
  ],

  // 回应策略
  strategyList: [
    {
      // 规则列表  ruleList => {rules} => ruleType, ruleKey,  condition, ruleValue
      ruleList: [{ rules: [{ ruleType: 0, condition: '==', ruleValue: '001' }] }],
      // 答复内容 列表
      conversationList: [
        {
          actionType: 0, // 可能去掉 选择类型
          actionText: 'fake',
          textLabels: ['话术标签2'],
        },
      ],
      actionType: 2, // 跳转动作
      businessId: 'front_mock_id_1', // 跳转动作选择 转业务流程的ID
      responseText: '撒打算大的撒打算大', //对于话术/标签
      responseLabel: ['话术标签2'],
      messageList: [
        // 短信模版、     接受号码 1变量，2词槽，  对于id
        { messageId: 'front_mock_id_1', telPhone: [1, '02'] },
      ],
    },
  ],

  // 高级配置
  hightConfig: {
    allowFlows: [], // 允许跳转至业务流程

    silenceAction: {
      // 沉默处理
      responseList: [],
      times: 1,
      //---
      action: {
        // 超限动作
        actionType: 2, // 跳转动作
        businessId: 'front_mock_id_1', // 跳转动作选择 转业务流程的ID
        responseText: '撒打算大的撒打算大', //对于话术/标签
        responseLabel: ['话术标签2'],
      },
      //---
      messageList: [
        // 短信模版、     接受号码 1变量，2词槽，  对于id
        { messageId: 'front_mock_id_1', telPhone: [1, '02'] },
      ],
    },

    rejectAction: {
      // 拒绝处理
    },

    clearAction: {
      // 澄清处理
    },

    unclearAction: {
      // 客户未听清意图
      wishId: '', // 未听清楚意图
    },
  },
};
