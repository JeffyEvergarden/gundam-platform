import config from '../../../src/config';

const successCode = config.successCode;

const getDetail = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      interfaceName: 'fate',
      interfaceDesc: 'fate stay night',
      interfaceUrl:
        'http://localhost:8000/aichat/gundamPages/detail/interfaceConfig?current=1&pageSize=10',
      interfaceType: 'post',
      readTimeOut: 2,
      requestHeader: '{"json": "123"}',
      requestParamList: [
        {
          paramName: '名字',
          paramKey: 'name',
          paramValueType: 0,
          require: 1,
          systemParams: '$systemDate',
          dataType: 0,
        },
        {
          paramName: '年龄',
          paramKey: 'age',
          paramValueType: 0,
          require: 1,
          systemParams: '$UUID36',
          dataType: 1,
        },
        {
          paramName: '日期',
          paramKey: 'date',
          paramValueType: 0,
          require: 1,
          systemParams: '$systemDate',
          dataType: 2,
        },
        {
          paramName: '时间',
          paramKey: 'datetime',
          paramValueType: 0,
          require: 1,
          systemParams: '$systemDate',
          dataType: 3,
        },
      ],
      requestBody: '{"json": "123"}',
      responseParam: { paramName: 'name', paramKey: 'name', paramMapKey: '123' },
    },
  });
};

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
  });
};

export default {
  'GET /aichat/robot/interface/interfaceInfo': getDetail,
  'POST /aichat/robot/interface/addInterface': normalDeal, //
  'POST /aichat/robot/interface/editInterface': normalDeal,
  'POST /aichat/robot/interface/deleteInterface': normalDeal,
  'POST /aichat/robot/interface/test': getDetail,
};
