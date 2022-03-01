export const BUSSINESS_CODE = [
  { name: '营销', label: '营销' },
  { name: '客服', label: '客服' },
  { name: '风险', label: '风险' },
  { name: '催收', label: '催收' },
  { name: '审批', label: '审批' },
  { name: '渠道', label: '渠道' },
];

export const listToMap = (list: any[]) => {
  let obj: any = {};
  list.forEach((item: any, index: number) => {
    obj[item.name] = { text: item.label };
  });
  return obj;
};
