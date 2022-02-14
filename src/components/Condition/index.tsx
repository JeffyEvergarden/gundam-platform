import React from 'react';

interface dataProp {
  children: any;
}

const Condition: React.FC<dataProp> = (props) => {
  const rif = props['r-if'];
  const show = props['r-show'];
  const children = props.children;

  const keys = Object.keys(props);

  if (keys.includes('r-if')) {
    return rif ? <>{children}</> : null;
  }
  if (keys.includes('r-show')) {
    return <div style={{ display: show ? 'block' : 'none' }}>{children}</div>;
  }
  return null;
};

export default Condition;
