import Condition from '@/components/Condition';
import { useLocation } from 'umi';
import { useRef } from 'react';

const useKeepAliveModel = (component: any) => {
  const _component = component ? (typeof component === 'function' ? component() : component) : null;
  const page = useRef(_component);

  return {
    page,
  };
};

const Route = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  const { path, component, needKeepAlive } = props;

  const match = currentPath === path;

  // const { page } = useKeepAliveModel(component);

  const _page = component ? (typeof component === 'function' ? component() : component) : null;

  if (match || needKeepAlive) {
    return <Condition r-show={match}>{_page}</Condition>;
  } else {
    return null;
  }
};

export default Route;
