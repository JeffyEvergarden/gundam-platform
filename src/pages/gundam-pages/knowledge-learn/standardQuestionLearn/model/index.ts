import { useState } from 'react';

import { unknownQuestionByFaqPageList } from './api';

export const useStandard = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await unknownQuestionByFaqPageList(params);
    setTableLoading(false);
    return res;
  };
  return {
    getList,
    tableLoading,
  };
};
