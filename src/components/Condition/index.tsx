import React from 'react';

import { useModel } from 'umi';

interface dataProp {
  children: any;
}

const Condition: React.FC<dataProp> = (props) => {
  const { initialState } = useModel('@@initialState');

  const access = props['access'];
  const rif = props['r-if'];
  const show = props['r-show'];
  const children = props.children;

  const keys = Object.keys(props);

  if (keys.includes('access')) {
    const { userAuth = [] } = initialState || {};
    return userAuth.includes(access) ? <>{children}</> : null;
  }

  if (keys.includes('r-if')) {
    return rif ? <>{children}</> : null;
  }

  if (keys.includes('r-show')) {
    return <div style={{ display: show ? 'block' : 'none' }}>{children}</div>;
  }
  return null;
};

export default Condition;
