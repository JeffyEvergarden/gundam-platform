import React, { useEffect } from 'react';
import AwaitList from '../components/awaitList';
import { useReviewedModal } from './model';

const ReviewedList = (props: any) => {
  const { list, getList, loading, totalPage } = useReviewedModal();

  useEffect(() => {
    getList();
  }, []);
  return <AwaitList pageType={'reviewed'} list={list} loading={loading} totalPage={totalPage} />;
};

export default ReviewedList;
