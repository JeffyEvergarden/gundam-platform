import { useState } from 'react';
import { queryLabelList } from '@/services/api';

export default function useGundamModel() {
  const [info, setInfo] = useState<any>({});

  // 机器人的全局变量
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
    {
      name: 'user_type1',
      label: '用户类型',
    },
    {
      name: 'user_age2',
      label: '用户年龄',
    },
    {
      name: 'user_type3',
      label: '用户类型',
    },
    {
      name: 'user_age4',
      label: '用户年龄',
    },
    {
      name: 'user_type5',
      label: '用户类型',
    },
    {
      name: 'user_age6',
      label: '用户年龄',
    },
    {
      name: 'user_type7',
      label: '用户类型',
    },
    {
      name: 'user_age8',
      label: '用户年龄',
    },
  ]);

  // 机器人的话术标签

  const [labelList, setLabelList] = useState<any>([]);

  const getLabelList = async () => {
    if (!info.id) {
      console.log('机器人的话术标签获取不到机器人id');
      return null;
    }
    let res: any = await queryLabelList({ robotId: info.id });
    let data: any[] = res.data || [];
    setLabelList(data);
  };

  return {
    info,
    setInfo,
    globalVarList,
    setGlobalVarList,
    labelList,
    getLabelList,
  };
}
