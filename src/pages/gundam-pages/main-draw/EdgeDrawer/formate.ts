// 节点信息 加工请求参数接口
import moment from 'moment';

const reg = /\d{4}-\d{2}-\d{2}/;
const reg2 = /\d{2}:\d{2}:\d{2}/;

export const parserBody = (form: any) => {
  form = depyClone(form);
  const ruleList: any = form?.ruleList || [];

  ruleList?.forEach((obj: any) => {
    obj?.rules?.forEach((item: any) => {
      if ((item?.ruleKeyType === 2 || item?.ruleKeyType === 3) && item.valueType === 3) {
        // 日期格式
        if (item.ruleValue && reg.test(item.ruleValue)) {
          try {
            item.ruleValue = moment(item.ruleValue);
          } catch (e) {
            item.ruleValue = undefined;
          }
        } else if (item.ruleValue && reg2.test(item.ruleValue)) {
          //时分秒
          try {
            let str = moment().format('YYYY-MM-DD');
            item.ruleValue = moment(str + ' ' + item.ruleValue);
          } catch (e) {
            item.ruleValue = undefined;
          }
        } else {
          item.ruleValue = undefined;
        }
      }
    });
  });

  return form;
};

// 节点信息 解析传回参数
export const processRequest = (form: any) => {
  // 日期格式 moment转化
  const ruleList: any = depyClone(form?.ruleList) || [];

  ruleList?.forEach((obj: any) => {
    obj?.rules?.forEach((item: any) => {
      if (item?.ruleValue instanceof moment) {
        if (item?.ruleKeyType === 2) {
          item.ruleValue = item.ruleValue.format('YYYY-MM-DD HH:mm:ss');
        } else if (item?.ruleKeyType === 3) {
          item.ruleValue = item.ruleValue.format('HH:mm:ss');
        }
      }
    });
  });

  return {
    ...form,
    ruleList,
  };
};

const depyClone = (obj: any) => {
  let newObj = {};
  if (Array.isArray(obj)) {
    //数组复制
    newObj = obj.map((item: any) => {
      return depyClone(item);
    });
  } else if (obj instanceof moment) {
    // 特殊对象
    return obj;
  } else if (obj instanceof Object) {
    // 对象复制
    Object.keys(obj).forEach((key: any) => {
      newObj[key] = depyClone(obj[key]);
    });
  } else {
    return obj;
  }
  return newObj;
};
