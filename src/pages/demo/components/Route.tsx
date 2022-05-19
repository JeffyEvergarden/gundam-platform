import { useLocation } from 'umi';

const Route = (props: any) => {
  const location = useLocation();

  const currentPath = location.pathname;

  const { path, component, needKeepAlive } = props;

  const match = currentPath === path;

  if (match || needKeepAlive) {
    return component ? (typeof component === 'function' ? component() : component) : null;
  } else {
    return null;
  }
};

export default Route;
