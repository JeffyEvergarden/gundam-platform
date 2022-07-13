import { AUTH_LIST } from './index';

const codeToNameMap = {}; // 后端code 到 中文名称映射
const valueToCodeMap = {}; // 前端code 到 后端code映射
const valueToObjMap = {}; // 前端code 到 后端code映射
const codeToObjMap = {};

const listToMap = (arr: any) => {
  arr.forEach((item: any) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      listToMap(item.children);
    } else {
      codeToNameMap[item.code] = item.label;
      valueToCodeMap[item.value] = item.code;
      valueToObjMap[item.value] = {
        code: item.code,
        label: item.label,
        value: item.value,
      };
      codeToObjMap[item.code] = valueToObjMap[item.value];
    }
  });
};

listToMap(AUTH_LIST);

export { codeToNameMap, valueToCodeMap, valueToObjMap, codeToObjMap };
