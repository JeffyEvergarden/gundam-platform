import { useState } from 'react';

import { questionList } from './api';

export const useUnknownQuestion = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await questionList(params);
    setTableLoading(false);
    return res;
  };

  return {
    getList,
    tableLoading,
  };
};
