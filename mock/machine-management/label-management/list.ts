import { Request, Response } from 'express';

const successCode = '0000';

const addNewLabel = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
  });
};

const editLabel = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
  });
};

const deleteLabel = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
  });
};

//话术标签列表
const getLabelList = (req: any, res: any) => {
  console.log(req.query);
  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalSize: 3,
      list: [
        {
          actionLabel: '话术标签1',
          id: 'hsbq1',
          labelDesc: '话术标签话术标签话术标签话术标签',
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
        },
        {
          actionLabel: '话术标签2',
          id: 'hsbq2',
          labelDesc: '话术标签话术标签话术标签话术标签',
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
        },
        {
          actionLabel: '话术标签3',
          id: 'hsbq3',
          labelDesc: '话术标签话术标签话术标签话术标签',
          creator: 'ujiangjiahao',
          createTime: '2022-02-17 11:54:59',
        },
      ],
    },
  });
};

// 菜单管理相关
export default {
  // 话术标签管理相关
  'GET /aichat/robot/actionLabel/actionLabelList': getLabelList, //话术标签列表
  'GET /aichat/robot/actionLabel/actionLabelInfo': getLabelList, //话术标签列表
  'POST /aichat/robot/actionLabel/actionLabelAdd': addNewLabel, //话术标签新增
  'POST /aichat/robot/actionLabel/actionLabelUpdate': editLabel, //话术标签编辑
  'POST /aichat/robot/actionLabel/actionLabelDelete': deleteLabel, //话术标签删除
};
