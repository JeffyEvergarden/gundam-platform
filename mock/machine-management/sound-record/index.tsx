import config from '@/config/index';
const successCode = config.successCode;

const getList = (req: any, res: any) => {
  let arr = new Array(11).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      dataStatus: index,
      faqId: index,
      id: index,
      question: '问题' + index,
      robotId: index,
      similarText: '相似问' + index,
      viewNum: index,
      updateTime: _date,
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

export default {
  'GET /aichat/robot/sound/pageList': getList,
};
