const successCode = '0000';

const getLexiconList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      pageSize: 20,
      totalPage: 80,
      page: 1,
      list: [
        {
          id: '011',
          robotId: '121313',
          entityName: '实体名称1',
          entityType: 1,
          entityDesc: '描述1',
          rule: '规则1',
          decri: '说明1',
          flowName: '1',
          entity: '0',
          creator: 'yyb',
          createTime: '2022-02-16',
          entityValueList: [
            { ID: 1, entityId: '1', entityValueName: '规则名称1', entityValue: '规则内容1' },
            { ID: 2, entityId: '2', entityValueName: '规则名称2', entityValue: '规则内容2' },
            { ID: 3, entityId: '3', entityValueName: '规则名称3', entityValue: '规则内容3' },
            { ID: 4, entityId: '4', entityValueName: '规则名称4', entityValue: '规则内容4' },
          ],
        },
        {
          id: '012',
          robotId: '1213133',
          entityName: '实体名称12',
          entityType: 12,
          entityDesc: '描述12',
          rule: '规则12',
          decri: '说明12',
          flowName: '12',
          entity: '0',
          creator: 'yyb',
          createTime: '2022-02-16',
          entityValueList: [
            { ID: 12, entityId: '12', entityValueName: '规则名称12', entityValue: '规则内容12' },
            { ID: 22, entityId: '22', entityValueName: '规则名称22', entityValue: '规则内容22' },
            { ID: 32, entityId: '32', entityValueName: '规则名称32', entityValue: '规则内容32' },
            { ID: 42, entityId: '42', entityValueName: '规则名称42', entityValue: '规则内容42' },
          ],
        },
      ],
    },
  });
};
const delLexicon = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

const addOrEdit = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    occurTime: '2022-0221-18:16',
  });
};

export default {
  'GET /aichat/robot/entity/listPage': getLexiconList, // 获取词库管理列表
  'POST /aichat/robot/entity/del': delLexicon, // 删除
  'POST /aichat/robot/entity/add': addOrEdit, // 新增词库
  'POST /aichat/robot/entity/update': addOrEdit, // 编辑词库
};
