import config from '@/config';

const successCode = config.successCode;

const getNodesConfig = (req: any, res: any) => {
  console.log('-------getNodesConfig');
  res.json({
    resultCode: successCode,
    datas: {
      name: '名侦探柯南',
      nodeDesc: '高中生侦探',
      nodeFlowId: 'front_mock_id_1',
      nodeSlots: [
        // 词槽列表
        {
          slotDesc: '1', // 词槽描述
          slotId: '011', // 词槽id
          slotName: '123', // 词槽名称
          textLabels: [], // 结束话术标签
          endText: '1213', // 结束话术
          required: true, // 是否必填
          clearText: [
            // 澄清话术列表
            {
              actionText: 'helloworld', // 澄清话术
              textLabels: [], // 标签
            },
          ],
        },
      ],
      conversationList: [
        // 对话回应
        {
          actionType: 'text', // 选择框
          nodeText: [
            // 答复内容列表
            {
              actionText: 'sadsadjljqiwoueioqwu', // 内容
              textLabels: ['话术标签2'], // 标签
            },
          ],
          hungUp: true, // 结束挂机
          transfer: '', // 动作 (下拉选择)
          isMessage: true, // 是否发送短信
          message: '', // 短信内容
          nodeTransferText: 'fake', // 过渡话术
          textLabels: [], // 过渡话术标签
          rules: [
            [
              // 且关系
              {
                ruleType: '用户意图', // 枚举值: 用户意图、变量、系统时间 等
                ruleKey: '011',
                condition: '==', // ==、!=、>=、>、<、<=、include、uninclude、like、unlike、unfill、fill
                ruleValue: '001',
              },
            ],
          ],
        },
      ],
    },
  });
};
