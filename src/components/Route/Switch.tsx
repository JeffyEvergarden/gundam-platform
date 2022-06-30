import { history, useLocation } from 'umi';
import React, { Component } from 'react';
import { useEffect } from 'react';

const LifeCycle = (props: any) => {
  const { onMount } = props;
  useEffect(() => {
    onMount?.();
  }, []);

  return null;
};

const Switch = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  let match: any;
  let element: any;
  let page404: any;
  let pageRedirect: any;

  React.Children.forEach(props.children, (child: any) => {
    if (match == null && React.isValidElement(child)) {
      element = child;
      const _path = (child?.props as any)?.path;
      match = currentPath === _path ? currentPath : null; // 匹配出来的
      if (!_path) {
        const hasRedirect = (child?.props as any)?.redirect ? true : false;
        const url = (child?.props as any)?.redirect;
        if (hasRedirect) {
          pageRedirect = (
            <LifeCycle
              onMount={() => {
                history.replace(url);
              }}
            />
          );
        } else {
          page404 = child;
        }
      }
    }
  });

  return match
    ? React.cloneElement(element, { computedMatch: match })
    : pageRedirect
    ? pageRedirect
    : page404
    ? React.cloneElement(page404, { needShow: true })
    : null;
};

export default Switch;
