import React, { useEffect } from 'react';
import AwaitList from '../components/awaitList';
import { useReviewedModal } from './model';

const PendingList = (props: any) => {
  const { list, getList, loading, totalPage } = useReviewedModal();

  useEffect(() => {
    getList();
  }, []);
  return <AwaitList pageType={'pending'} list={list} loading={loading} totalPage={totalPage} />;
};

export default PendingList;
