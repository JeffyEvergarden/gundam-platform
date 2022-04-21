// 节点信息 加工请求参数接口
import moment from 'moment';

const reg = /\d{4}-\d{2}-\d{2}/;

export const parserBody = (info: any) => {
  info.name = info.name || info.nodeName;
  const strategyList: any[] = info?.strategyList || [];
  strategyList.forEach((_item: any) => {
    _item?.ruleList?.forEach((obj: any) => {
      obj?.rules?.forEach((item: any) => {
        // 日期格式且是自定义
        if (item?.ruleKeyType === 2 && item.valueType === 3) {
          // 日期格式
          if (Array.isArray(item.ruleValue)) {
            try {
              item.ruleValue[0] = moment(item.ruleValue[0]);
              item.ruleValue[1] = moment(item.ruleValue[1]);
            } catch (e) {
              item.ruleValue = undefined;
            }
          } else {
            if (item.ruleValue && reg.test(item.ruleValue)) {
              try {
                item.ruleValue = moment(item.ruleValue);
              } catch (e) {
                item.ruleValue = undefined;
              }
            } else {
              item.ruleValue = undefined;
            }
          }
        }
      });
    });
  });

  return info;
};

// 节点信息 解析传回参数
export const processRequest = (form1: any, form2: any) => {
  // 日期格式 moment转化
  form1 = deepClone(form1);
  const strategyList: any = form1?.strategyList || [];

  strategyList.forEach((_item: any) => {
    _item?.ruleList?.forEach((obj: any) => {
      obj?.rules?.forEach((item: any) => {
        if (item?.ruleValue instanceof moment) {
          item.ruleValue = item.ruleValue.format('YYYY-MM-DD HH:mm:ss');
        } else if (Array.isArray(item?.ruleValue)) {
          try {
            item.ruleValue[0] = item.ruleValue[0]?.format('YYYY-MM-DD HH:mm:ss');
            item.ruleValue[1] = item.ruleValue[1]?.format('YYYY-MM-DD HH:mm:ss');
          } catch (e) {
            item.ruleValue = undefined;
          }
        }
      });
    });
  });

  form2 = processForm(form2);

  return {
    ...form1,
    highConfig: form2,
  };
};

const deepClone = (obj: any) => {
  let newObj = {};
  if (Array.isArray(obj)) {
    //数组复制
    newObj = obj.map((item: any) => {
      return deepClone(item);
    });
  } else if (obj instanceof moment) {
    // 特殊对象
    return obj;
  } else if (obj instanceof Object) {
    // 对象复制
    Object.keys(obj).forEach((key: any) => {
      newObj[key] = deepClone(obj[key]);
    });
  } else {
    return obj;
  }
  return newObj;
};

export const processForm = (form: any) => {
  const _form = deepClone(form);
  const list: any[] = ['silenceAction', 'rejectAction', 'clearAction', 'unclearAction'];

  list.forEach((key: any) => {
    const action = _form[key].action;
    // 遍历键值
    let _list = Object.keys(action);
    if (_list.length === 0) {
      _form[key].action = undefined;
    } else if (_list.length > 0) {
      const _item: any = _list.find((_key: any) => {
        // 数组长度必须大于0
        if (Array.isArray(action[_key]) && action[_key].length === 0) {
          return false;
        }
        // 找到返回 该值不能为空且不等于0
        return !action[_key] && action[_key] !== 0;
      });
      if (_item) {
        _form[key].action = undefined;
      }
    }
  });

  return _form;
};
