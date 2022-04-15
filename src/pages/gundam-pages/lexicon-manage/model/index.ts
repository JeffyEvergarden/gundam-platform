import { useState } from 'react';
import { lexiconList, delLexicon, add, edit } from './api';

export const useLexiconModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getLexiconList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await lexiconList(params);
    res?.data?.list?.map((item: any) => {
      let entityValueNameStr = '';
      item?.entityValueList?.map((el: any, idx: number) => {
        if (idx !== item?.entityValueList.length - 1) {
          entityValueNameStr += el?.entityValueName;
          entityValueNameStr += ',';
        } else {
          entityValueNameStr += el?.entityValueName;
        }
        item.entityValueNameStr = entityValueNameStr;
      });
    });
    setTableLoading(false);
    return res;
  };

  const deleteLexicon = async (data?: any) => {
    setTableLoading(true);
    let res: any = await delLexicon(data);
    setTableLoading(false);
    return res;
  };

  const addLexicon = async (params?: any) => {
    setTableLoading(true);
    let res: any = await add(params);
    setTableLoading(false);
    return res;
  };

  const editLexicon = async (params?: any) => {
    setTableLoading(true);
    let res: any = await edit(params);
    setTableLoading(false);
    return res;
  };

  return {
    getLexiconList,
    deleteLexicon,
    addLexicon,
    editLexicon,
    tableLoading,
  };
};
