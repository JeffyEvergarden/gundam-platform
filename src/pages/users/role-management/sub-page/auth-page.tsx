import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { Tree } from 'antd';

import style from '../style.less';

const AuthPage = (props: any) => {
  return (
    <div className={style['auth-page']}>
      <div className={style['']}>{/* <Tree  /> */}</div>
    </div>
  );
};

export default AuthPage;
