import { useState } from 'react';

export default function useGundamModel() {
  const [info, setInfo] = useState<any>({});

  const [globalVarList, setGlobalVarList] = useState<any>([
    {
      name: 'user_name',
      label: '用户名',
    },
    {
      name: 'user_type',
      label: '用户类型',
    },
    {
      name: 'user_age',
      label: '用户年龄',
    },
  ]);

  return {
    info,
    setInfo,
    globalVarList,
    setGlobalVarList,
  };
}
