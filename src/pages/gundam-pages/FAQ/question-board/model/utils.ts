import { Editor, Range, Transforms } from 'slate';
import moment from 'moment';

export function replaceSymbols(str: string) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function genLinkNode(url: string, text?: string, info?: any): any {
  const linkNode: any = {
    type: 'link',
    url: replaceSymbols(url),
    target: info.target || '__blank',
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
  Transforms.setNodes(linkNode, info);
  Transforms.insertNodes(editor, linkNode);
  // https://github.com/wangeditor-team/wangEditor/issues/332
  // 不能直接使用 insertText, 会造成添加的空格被添加到链接文本中，参考上面 issue，替换为 insertFragment 方式添加空格
  editor.insertFragment([{ text: ' ' }]);
}

// --------------------------------
// 数据加工
export const processRequest = (data: any) => {
  data = deepClone(data); // 深克隆
  let answerList = data.answerList;
  answerList.forEach((item: any) => {
    let enableTime = item.enableTime;
    // 生效时间
    item.enable = item.enable ? 1 : 0;
    // 时间格式化
    item.enableTime = enableTime.map((subitem: any) => {
      if (subitem instanceof moment) {
        console.log((subitem as any).format?.('YYYY-MM-DD HH:mm:ss'));
        return (subitem as any).format?.('YYYY-MM-DD HH:mm:ss');
      }
      return subitem;
    });
  });
  // 推荐问题启用
  data.questionRecommend = data.questionRecommend ? 1 : 0;

  return data;
};

const reg = /\d{4}-\d{2}-\d{2}/;

export const processBody = (data: any) => {
  let answerList = data.answerList || [];
  answerList.forEach((item: any) => {
    let enableTime = item.enableTime || [];
    // 生效时间
    item.enable = item.enable ? true : false;
    // 时间格式化
    item.enableTime = enableTime.map((subitem: any) => {
      if (subitem && reg.test(subitem)) {
        return moment(subitem);
      }
      return subitem;
    });
  });
  data.questionRecommend = data.questionRecommend ? true : false;
  return data;
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
