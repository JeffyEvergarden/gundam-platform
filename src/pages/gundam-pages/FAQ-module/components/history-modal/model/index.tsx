import config from '@/config/index';
import { useState } from 'react';
import { getHistoryList } from '../../../model/api';

const successCode = config.successCode;

export const useHistoryModel = () => {
  const [list, setList] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getHistoryList(params);
    console.log(res);
    let data: any = [];
    if (res.resultCode == successCode) {
      data = res?.data?.list || [];
      let reg = /\$\{getResoureUrl\}/g;
      const reg1 = /^\<\w+\>/;
      const reg2 = /\<\/\w+\>$/;
      console.log(data);

      data?.map((h: any) => {
        h?.historyList?.map?.((subitem: any) => {
          let answer = subitem.answer || '';
          if (reg1.test(answer) && reg2.test(answer)) {
            subitem.answer = answer.replace(reg, '/aichat/robot/file/getFile');
          }
          return subitem;
        });
        return h.historyList;
      });
      console.log(data);

      setList(data);
      setTotalPage(res?.data?.totalPage);
    } else {
      setList([]);
      setTotalPage(0);
    }
    setLoading(false);
    return { data, total: res?.data?.totalPage };
  };

  return {
    list,
    totalPage,
    getList,
    loading,
  };
};
