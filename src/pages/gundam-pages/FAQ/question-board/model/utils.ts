import { Editor, Range, Transforms } from 'slate';

export function replaceSymbols(str: string) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function genLinkNode(url: string, text?: string): any {
  const linkNode: any = {
    type: 'link',
    url: replaceSymbols(url),
    children: text ? [{ text }] : [],
  };
  return linkNode;
}

export async function insertLink(editor: any, text: string, url: string) {
  if (!url) return;
  if (!text) text = url; // 无 text 则用 url 代替

  // 转换 url
  const parsedUrl = url;

  // 链接前后插入空格，方便操作
  editor.insertText(' ');

  const linkNode = genLinkNode(parsedUrl, text);
  Transforms.insertNodes(editor, linkNode);
  // https://github.com/wangeditor-team/wangEditor/issues/332
  // 不能直接使用 insertText, 会造成添加的空格被添加到链接文本中，参考上面 issue，替换为 insertFragment 方式添加空格
  editor.insertFragment([{ text: ' ' }]);
}
