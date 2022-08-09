import { useState } from 'react';

import { unknownQuestionByFaqPageList, delStard } from './api';

export const useStandard = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getListUnknown = async (params?: any) => {
    setTableLoading(true);
    let res: any = await unknownQuestionByFaqPageList(params);
    setTableLoading(false);
    return res;
  };

  const delStardQuestion = async (params?: any) => {
    setTableLoading(true);
    let res: any = await delStard(params);
    setTableLoading(false);
    return res;
  };

  return {
    getListUnknown,
    delStardQuestion,
    tableLoading,
  };
};
