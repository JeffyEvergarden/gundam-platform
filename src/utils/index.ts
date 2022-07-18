export function throttle(fn: (...args: any[]) => void, second: number) {
  let timer: any = null;

  return (...args: any[]) => {
    if (timer) {
      return;
    }

    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, second);
  };
}

// 格式化百分比
export function formatePercent(val: number): string {
  if (typeof val === 'number') {
    let str1 = (val * 100).toFixed(0);
    let str2 = (val * 100).toFixed(2);
    return (Number(str1) === Number(str2) ? str1 : str2) + '%';
  }
  return '0%';
}
// 百分比转数字
export const toNumber = (percent: any) => {
  if (!percent) return;
  let str = percent.slice(0, -1);
  let num = Number(str) / 100;
  return num;
};

//格式化两位小数  补0
export function twoDecimal_f(x: any) {
  let f_x = parseFloat(x);
  if (isNaN(f_x)) {
    return 0;
  }
  f_x = Math.round(x * 100) / 100;
  let s_x = f_x.toString();
  let pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

//图片回显加工
export function img(text: any) {
  let reg = /\$\{getResoureUrl\}/g;
  const reg1 = /^\<\w+\>/;
  const reg2 = /\<\/\w+\>$/;
  if (reg1.test(text) && reg2.test(text)) {
    return text.replace(reg, '/aichat/robot/file/getFile');
  }
  return text;
}

//下载 - 对象转get参数
export function ObjToSearch(params: any) {
  let str: string = '';
  Object.keys(params).forEach((item) => {
    // console.log(params[item]);
    if (typeof params[item] != 'number') {
      if (Array.isArray(params[item])) {
        if (params[item]?.length) {
          let res = params[item]?.map((v: any, index: any) => `&${item}=${v}`).join('');
          str += res;
        }
      } else {
        if (params[item]) {
          str += `&${item}=${params[item]}`;
        }
      }
    } else {
      str += `&${item}=${params[item]}`;
    }
  });
  return str.replace('&', '');
}
