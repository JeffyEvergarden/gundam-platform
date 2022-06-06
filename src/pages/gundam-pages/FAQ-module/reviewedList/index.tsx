import React, { useEffect } from 'react';
import AwaitList from '../components/awaitList';
import { useReviewedModal } from './model';

const PendingList = (props: any) => {
  const { list, getList, loading } = useReviewedModal();

  useEffect(() => {
    getList();
  });
  return <AwaitList pageType={'reviewed'} />;
};

export default PendingList;
