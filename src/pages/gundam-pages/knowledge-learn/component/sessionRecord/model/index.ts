import { useState } from 'react';

import { sessionRecordPageList } from './api';

export const useSessionList = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getSessionList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await sessionRecordPageList(params);
    setTableLoading(false);
    return res;
  };
  return {
    getSessionList,
    tableLoading,
  };
};
