import React from 'react';

interface dataProp {
  children: any;
}

const Condition: React.FC<dataProp> = (props) => {
  return props['r-if'] ? props.children : null;
};

export default Condition;
