import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useModel } from 'umi';
import style from './style.less';
import logo from '@/asset/image/homelogo.png';

// 首页
const Home: React.FC = (props: any) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { fetchAuthInfo } = initialState || {};

  const [type, setType] = useState<any>('');

  // 这个权限是用户类型的
  const init = async () => {
    // console.log('init:', initialState);
    let userAuth: any = '';
    if (initialState?.userAuth?.userType) {
      // 已经获取了权限
      userAuth = initialState?.userAuth?.userType || '';
    } else {
      // 需要调接口
      let result: any = await fetchAuthInfo?.();
      if (Object.keys(result).length > 0) {
        setInitialState({
          ...(initialState as any),
          userAuth: {
            ...initialState?.userAuth,
            ...result,
          },
        });
        userAuth = result?.userType || '';
      }
    }
    if (userAuth === 'leader') {
      setType('leader');
    } else if (userAuth === 'user') {
      setType('user');
    }
  };

  // 替换url
  const replaceState = () => {
    let pathName = window.location.pathname;
    let isHasPrefix = pathName.includes('/bdp');
    console.log(pathName, isHasPrefix);
    if (isHasPrefix) {
      let newPathName: string = pathName.replace('/bdp', '');
      console.log('进行替换', newPathName);
      history.replaceState(null, '', newPathName || '/');
    }
  };

  useEffect(() => {
    // replaceState();
    init();
  }, []);

  return (
    <div className={style['image-bg']}>
      <img src={logo} className={style['image']} />
    </div>
  );
};

export default Home;
