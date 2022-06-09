import React, { useEffect } from 'react';
import AwaitList from '../components/awaitList';

//待处理
const PendingList = (props: any) => {
  return <AwaitList pageType={'pending'} />;
};

export default PendingList;
