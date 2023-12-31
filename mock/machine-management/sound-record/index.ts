import config from '../../../src/config';
const successCode = config.successCode;

const getList = (req: any, res: any) => {
  let arr = new Array(11).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: index,
      robotId: index,
      type: Math.ceil(Math.random() * 4),
      applyNames: ['1-1-1', '2-2-2', '3-3-3', '4-4-4'],
      text: '转写文本' + index,
      soundPath: '/',
      name: '录音名称' + index + '录音名称' + index + '录音名称' + index,
      ststus: Math.ceil(Math.random() * 3),
      creator: 'jiangjiahao',
      createTime: _date,
      updateTime: _date,
      updateBy: 'jiangjiahao',
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      pageSize: 10,
      totalPage: 11,
      page: 1,
      list: arr,
    },
  });
};

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

export default {
  'GET /aichat/robot/sound/pageList': getList,
  'POST /aichat/robot/sound/upload': normalDeal,
  'POST /aichat/robot/sound/delete': normalDeal,
};
