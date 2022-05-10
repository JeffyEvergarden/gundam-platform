import { Request, Response } from 'express';
import config from '../../../src/config';

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getFaqList = (req: any, res: any) => {
  const jsonObj: any = {
    name: '阿斯拉大',
    email: 'ljk15916807596@qq.com',
    content: '冲啊，旋风冲锋',
    time: '2022-04-01 14:00:00',
    channel: ['微信', 'API', 'APP'],
    creator: '伟大的教团',
    times: 100,
  };
  let list = new Array(10).fill(1).map((item: any, index: number) => {
    return {
      ...jsonObj,
      name: '阿斯拉大' + index,
      times: 100 + index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: {
      pageSize: 10,
      totalSize: 50,
      page: 1,
      list: [...list],
    },
  });
};

const getTreeList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: [
      {
        title: '全部分类',
        key: '0',
        children: [
          {
            title: '贷款产品分类',
            key: '0-0',
            children: [
              {
                title: '循环贷',
                key: '0-0-1',
              },
              {
                title: '极速贷',
                key: '0-0-2',
              },
            ],
          },
          {
            title: '产品操作',
            key: '0-1',
            children: [
              {
                title: '神奇流程',
                key: '0-1-0',
              },
              {
                title: '神奇流程2',
                key: '0-1-1',
              },
            ],
          },
        ],
      },
    ],
  });
};

export default {
  'GET /aichat/faq/list': getFaqList, // 获取问答列表
  'GET /aichat/faq/tree': getTreeList,
  'POST /aichat/faq/tree/add': normalDeal, // 添加分类节点
  'POST /aichat/faq/tree/edit': normalDeal, // 编辑分类节点
  'POST /aichat/faq/tree/delete': normalDeal, // 删除分类节点
};
