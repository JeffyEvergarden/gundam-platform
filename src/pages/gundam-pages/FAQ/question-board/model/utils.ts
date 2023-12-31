import moment from 'moment';
import { Transforms } from 'slate';
import { SlateTransforms } from '@wangeditor/editor';

export function replaceSymbols(str: string) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function genLinkNode(url: string, text?: string, info?: any): any {
  const linkNode: any = {
    type: 'link',
    url: replaceSymbols(url),
    target: info?.target || '__blank',
    children: text ? [{ text }] : [],
  };
  return linkNode;
}

export async function insertLink(editor: any, text: string, url: string, info?: any) {
  if (!url) return;
  if (!text) text = url; // 无 text 则用 url 代替

  // 转换 url
  const parsedUrl = url;

  // 链接前后插入空格，方便操作
  editor.insertText(' ');

  const linkNode = genLinkNode(parsedUrl, text, info);
  console.log(linkNode, info);

  SlateTransforms.setNodes(linkNode, info);
  SlateTransforms.insertNodes(editor, linkNode);
  // https://github.com/wangeditor-team/wangEditor/issues/332
  // 不能直接使用 insertText, 会造成添加的空格被添加到链接文本中，参考上面 issue，替换为 insertFragment 方式添加空格
  editor.insertFragment([{ text: ' ' }]);
}

// --------------------------------
// 数据加工   答案看板
export const processRequest = (data: any) => {
  data = deepClone(data); // 深克隆
  let answerList = data.answerList || [];
  let reg = new RegExp('/aichat/robot/file/getFile', 'g');
  answerList.forEach((item: any) => {
    let enableTime = item.enableTime || [];
    // 生效时间
    item.enable = item.enable ? 1 : 0;
    // 时间格式化
    // item.enableTime = enableTime.map((subitem: any) => {
    //   if (subitem instanceof moment) {
    //     console.log((subitem as any).format?.('YYYY-MM-DD HH:mm:ss'));
    //     return (subitem as any).format?.('YYYY-MM-DD HH:mm:ss');
    //   }
    //   return subitem;
    // });
    item.answer = item.answer || '';
    item.answer = item.answer.replace(reg, '${getResoureUrl}');

    item.enableStartTime = item?.enableStartTime?.format?.('YYYY-MM-DD HH:mm:ss');
    item.enableEndTime = item?.enableEndTime?.format?.('YYYY-MM-DD HH:mm:ss');
  });
  // 推荐问题启用
  data.questionRecommend = data.questionRecommend ? 1 : 0;
  return data;
};

const reg = /\d{4}-\d{2}-\d{2}/;

const reg1 = /^\<.+\>/;
const reg2 = /\<\/\w+\>$/;

export const processBody = (data: any, robotType = '文本') => {
  let answerList = data.answerList || [];
  let reg = /\$\{getResoureUrl\}/g;
  answerList.forEach((item: any) => {
    let enableTime = item.enableTime || [];
    // 生效时间
    item.enable = item.enable ? true : false;
    // 时间格式化
    let answer = item.answer || '';
    if (robotType === '文本') {
      if (reg1.test(answer) && reg2.test(answer)) {
        item.answer = answer.replace(reg, '/aichat/robot/file/getFile');
      } else if (reg1.test(answer) || reg2.test(answer)) {
        item.answer = '';
      } else if (typeof answer === 'string') {
        item.answer = '<p>' + answer + '</p>';
      } else {
        item.answer = '';
      }
    }

    item.enableStartTime = item?.enableStartTime ? moment(item?.enableStartTime) : undefined;
    item.enableEndTime = item?.enableEndTime ? moment(item?.enableEndTime) : undefined;
  });
  data.questionRecommend = data.questionRecommend ? true : false;
  return data;
};

export const processAnswerRequest = (data: any) => {
  data = deepClone(data); // 深克隆
  let reg = new RegExp('/aichat/robot/file/getFile', 'g');
  data.answer = data.answer || '';
  data.answer = data.answer.replace(reg, '${getResoureUrl}');

  data.soundRecordId = data?.soundRecordList?.[0]?.id;

  let enableTime = data.enableTime;
  // 生效时间
  data.enable = data.enable ? 1 : 0;

  data.enableStartTime = data?.enableStartTime?.format?.('YYYY-MM-DD HH:mm:ss');
  data.enableEndTime = data?.enableEndTime?.format?.('YYYY-MM-DD HH:mm:ss');

  return data;
};

export const processAnswerBody = (data: any, robotType = '文本') => {
  let enableTime = data.enableTime || [];
  // 生效时间
  data.enable = data.enable ? true : false;
  // 时间格式化
  let reg = /\$\{getResoureUrl\}/g;
  let answer = data.answer || '';
  if (robotType === '文本') {
    if (reg1.test(answer) && reg2.test(answer)) {
      data.answer = answer.replace(reg, '/aichat/robot/file/getFile');
    } else if (reg1.test(answer) || reg2.test(answer)) {
      data.answer = '';
    } else if (typeof answer === 'string') {
      data.answer = '<p>' + answer + '</p>';
    } else {
      data.answer = '';
    }
  }

  data.enableStartTime = data?.enableStartTime ? moment(data?.enableStartTime) : undefined;
  data.enableEndTime = data?.enableEndTime ? moment(data?.enableEndTime) : undefined;
  console.log(
    robotType,
    reg1.test(answer),
    reg2.test(answer),
    answer.replace(reg, '/aichat/robot/file/getFile'),
  );
  console.log(data);
  return data;
};

export const deepClone = (obj: any) => {
  let newObj = {};
  if (Array.isArray(obj)) {
    //数组复制
    newObj = obj.map((item: any) => {
      return deepClone(item);
    });
  } else if (obj instanceof moment) {
    // 特殊对象
    return obj;
  } else if (typeof obj === 'function') {
    // 对象复制
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
