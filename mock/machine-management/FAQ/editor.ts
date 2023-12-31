import config from '../../../src/config';

// faq 富文本模块相关

const successCode = config.successCode;

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const uploadFile = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    success: true,
    data: 'fategrandorder',
  });
};

//获取图片
// no such file or directory, stat '/Users/jeffy/Documents/code/gundam-platform/logo.png'
const getFile = (req: any, res: any, next: any) => {
  var options = {
    root: './public',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  // 图片
  res.sendFile('logo.png', options, function (err: any) {
    if (err) {
      next(err);
    } else {
    }
  });
};

const getInfo = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      question: '123',
      faqTypeId: '0-0-1',
      answerList: [
        {
          answer:
            '<p>122<img src="${getResoureUrl}?path=fategrandorder" alt="fategrandorder" data-href="" style=""/></p>',
          channelList: ['APP'],
          enable: 1,
          enableStartTime: '2022-05-01 16:28:20',
          enableEndTime: '2022-05-28 16:28:23',
          enableTime: ['2022-05-01 16:28:20', '2022-05-28 16:28:23'],
        },
      ],
      questionRecommend: 1,
      recommendList: [
        { recommendBizType: '2', recommendId: 'front_mock_id_0', recommend: '前端mock-流程0' },
      ],
    },
  });
};

const getAnswer = (req: any, res: any) => {
  console.log('获取信息');
  res.json({
    resultCode: successCode,
    data: {
      question: '123',
      faqTypeId: '0-0-1',
      answer:
        '<li>1223</li><ul><li>2324</li><li>123123</li></ul><div data-w-e-type="todo"><input type="checkbox" disabled >1233131</div>',
      channelList: ['APP'],
      enable: 1,
      enableStartTime: '2022-05-01 16:28:20',
      enableEndTime: '2022-05-28 16:28:23',
      enableTime: ['2022-05-01 16:28:20', '2022-05-28 16:28:23'],
    },
  });
};

const isEdit = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      editFlag: true,
    },
  });
};

export default {
  'POST /aichat/robot/file/uploadFile': uploadFile, // 获取问答列表
  'GET /aichat/robot/file/getFile': getFile,
  'POST /aichat/robot/faq/robotFaqAdd': normalDeal,
  'POST /aichat/robot/faq/robotFaqEdit': normalDeal,
  'GET /aichat/robot/faq/robotFaqInfo': getInfo,
  'POST /aichat/robot/faq/answerAdd': normalDeal,
  'POST /aichat/robot/faq/answerEdit': normalDeal,
  'POST /aichat/robot/faq/answerDelete': normalDeal,
  'GET /aichat/robot/faq/answerInfo': getAnswer,
  'GET /aichat/robot/faq/approvalInfo': getAnswer,

  'POST /aichat/robot/faq/answerIsEdit': isEdit, //判断能不能进行新增/编辑
};
