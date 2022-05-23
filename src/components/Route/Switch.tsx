import { useLocation } from 'umi';
import React from 'react';

const Switch = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  let match: any;
  let element: any;
  let page404: any;

  React.Children.forEach(props.children, (child: any) => {
    if (match == null && React.isValidElement(child)) {
      element = child;
      const _path = (child?.props as any)?.path;
      match = currentPath === _path ? currentPath : null; // 匹配出来的
      if (!_path) {
        page404 = child;
      }
    }
  });

  return match ? React.cloneElement(element, { computedMatch: match }) : page404 || null;
};

export default Switch;
