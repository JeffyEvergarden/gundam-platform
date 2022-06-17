import config from '@/config/index';
import { useState } from 'react';
import { getAnswerList } from '../../../model/api';

const successCode = config.successCode;

export const useAnswerListModel = () => {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async (params: any) => {
    setLoading(true);
    let res = await getAnswerList(params);
    console.log(res);
    let data: any = [];
    if (res.resultCode == successCode) {
      data = res?.data || [];
      let reg = /\$\{getResoureUrl\}/g;
      const reg1 = /^\<\w+\>/;
      const reg2 = /\<\/\w+\>$/;

      data?.map?.((subitem: any) => {
        let answer = subitem.answer || '';
        if (reg1.test(answer) && reg2.test(answer)) {
          subitem.answer = answer.replace(reg, '/aichat/robot/file/getFile');
        }
        return subitem;
      });

      setList(data);
    } else {
      setList([]);
    }
    setLoading(false);
    return { data };
  };

  return {
    list,
    getList,
    loading,
  };
};
