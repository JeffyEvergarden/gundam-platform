import moment from 'moment';
import config from '../../../src/config';

const successCode = config.successCode;

const defaultList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getSampleList = (req: any, res: any) => {
  let arr = new Array(10).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: index + 1,
      sampleName: '样本' + index,
      markProgress: '1/1',
      createTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 3,
      nextTestTime: '2022-07-12',
      list: arr,
    },
  });
};

export default {
  'GET /aichat/robot/sample/samplePageList': getSampleList,
  'POST /aichat/robot/sample/addSample': defaultList,
  'POST /aichat/robot/sample/updateSample': defaultList,
  'POST /aichat/robot/sample/deleteSample': defaultList,
};
