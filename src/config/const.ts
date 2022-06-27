import userManage from './auth/user-manage';

// appKey ---> 前端key值
// key ----> 后端key值
// label ----> 中文

const _keyMap = new Map(); // 后端key值 ---> 得到名称
const _appKeyMap = new Map(); // 前端key值 ---> 后端key值

const deepMap = (arr: any[]) => {
  arr.forEach((item: any) => {
    if (item.appKey && item.key) {
      _appKeyMap.set(item.appKey, item.key);
    }
    if (item.key) {
      _keyMap.set(item.key, item.label);
    }
    if (Array.isArray(item.children)) {
      deepMap(item.children);
    }
  });
};

export const AUTH_LIST = [...userManage];

export { _keyMap as keyMap, _appKeyMap as appKeyMap };

// 输出 AUTH_LIST、 keyMap 、 appKeyMap
