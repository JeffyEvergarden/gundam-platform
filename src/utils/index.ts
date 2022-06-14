// const numeral = require('numeral');

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

// export function formateNumer(val: number): string {
//   if (isNaN(val)) {
//     return '0';
//   }
//   let str = numeral(val).format('0,0');
//   if (val % 1 !== 0) {
//     str = numeral(val).format('0,0.00');
//   }
//   return str;
// }
