import { useLocation } from 'umi';
import React from 'react';

const Switch = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  let match: any;
  let element: any;

  React.Children.forEach(props.children, (child: any) => {
    if (match == null && React.isValidElement(child)) {
      element = child;
      match = currentPath === (child?.props as any)?.path ? currentPath : null; // 匹配出来的
    }
  });

  return <>{match ? React.cloneElement(element, { computedMatch: match }) : null}</>;
};

export default Switch;
