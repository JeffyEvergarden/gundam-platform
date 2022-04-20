const reg: any = /(\$|#)\{\w+\}/g;

const formatHtml = (str: any) => {
  if (!str) {
    return '无内容展示';
  }
  // 正则列表匹配出来的
  const list: any = str.match(reg);
};
