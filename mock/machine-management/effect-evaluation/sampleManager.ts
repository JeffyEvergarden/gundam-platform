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
  let arr = new Array(11).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: index + 1,
      robotId: '100',
      sampleSetId: index + 1,
      sampleSetName: '样本' + index,
      tagProgress: '1/1',
      creator: 'jiangjiahao',
      createTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
      updateTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
      dataStatus: 0,
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 11,
      nextTestTime: '2022-07-12',
      list: arr,
    },
  });
};

const getDetailSampleList = (req: any, res: any) => {
  let arr = new Array(11).fill(1);
  let _date = Date.now();

  arr = arr.map((item: any, index: number) => {
    let obj = {
      id: index + 1,
      robotId: '100',
      dialogueSample: '样本' + index, //对话样本
      replyType: 1, //1明确回复 2澄清 3拒识
      tagStatus: 1, //1未标注 2待确认 3已标注
      faqIntentList: [
        {
          bizId: '1',
          bizName: 'name1',
          bizType: '1', //1标准问 2意图
        },
        {
          bizId: '2',
          bizName: '那么',
          bizType: '2',
        },
      ],
      creator: 'jiangjiahao',
      createTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
      updateTime: moment(new Date(_date + 60 * 60 * 1000 * index)).format('YYYY-MM—DD hh:mm'),
      dataStatus: 0,
      updateBy: 'jiangjiahao',
    };
    return obj;
  });

  res.json({
    resultCode: successCode,
    data: {
      page: 1,
      pageSize: 10,
      totalPage: 11,
      nextTestTime: '2022-07-12',
      list: arr,
    },
  });
};

export default {
  'GET /aichat/robot/assess/sampleListPage': getSampleList,
  'POST /aichat/robot/assess/sampleAdd': defaultList,
  'POST /aichat/robot/assess/sampleUpdate': defaultList,
  'POST /aichat/robot/assess/sampleDelete': defaultList,
  'POST /aichat/robot/assess/sampleUpload': defaultList,

  'GET /aichat/robot/assess/sampleDetailListPage': getDetailSampleList,
};
