import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';
import {
  addAnswer,
  addQuestion,
  editAnswer,
  editApproval,
  editQuestion,
  getAnswerInfo,
  getApprovalInfo,
  getFaqConfig,
  getQuestionInfo,
} from './api';
const successCode = config.successCode;

export const useQuestionModel = () => {
  const [maxRecommendLength, setMaxRecommendLength] = useState<any>(0);

  const _getFaqConfig = async (id: any) => {
    let res = await getFaqConfig({
      robotId: id,
      configType: 2,
    });
    if (res.resultCode === successCode) {
      let data = res.data || [];
      let _item = data.find((item: any) => {
        return item.configKey === 'FAQ_RECOMMEND_LIMIT';
      });
      let val = _item?.configValue;
      val = !isNaN(val) ? Number(val) : 1;
      setMaxRecommendLength(val);
      return true;
    } else {
      message.error(res.resultDesc || '获取faq配置失败');
      return false;
    }
  };

  const addNewQuestion = async (data: any) => {
    let res: any = await addQuestion(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '添加失败');
      return false;
    }
  };

  const updateQuestion = async (data: any) => {
    let res: any = await editQuestion(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '保存失败');
      return false;
    }
  };

  const _getQuestionInfo = async (params: any) => {
    let res: any = await getQuestionInfo(params);
    if (res.resultCode === successCode) {
      return res.data;
    } else {
      message.error(res.resultDesc || '获取信息失败');
      return false;
    }
  };

  return {
    maxRecommendLength,
    addNewQuestion,
    updateQuestion,
    getQuestionInfo: _getQuestionInfo,
    getFaqConfig: _getFaqConfig,
  };
};

export const useAnswerModel = () => {
  const addNewAnswer = async (data: any) => {
    let res: any = await addAnswer(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '添加失败');
      return false;
    }
  };

  const updateAnswer = async (data: any) => {
    let res: any = await editAnswer(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '保存失败');
      return false;
    }
  };

  const _getAnswerInfo = async (params: any) => {
    let res: any = await getAnswerInfo(params);
    if (res.resultCode === successCode) {
      return res.data;
    } else {
      message.error(res.resultDesc || '获取信息失败');
      return false;
    }
  };

  const _getApprovalInfo = async (params: any) => {
    let res: any = await getApprovalInfo(params);
    if (res.resultCode === successCode) {
      return res.data;
    } else {
      message.error(res.resultDesc || '获取信息失败');
      return false;
    }
  };
  const updateApproval = async (data: any) => {
    let res: any = await editApproval(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res.resultDesc || '保存失败');
      return false;
    }
  };

  return {
    addNewAnswer,
    updateAnswer,
    getAnswerInfo: _getAnswerInfo,
    _getApprovalInfo,
    updateApproval,
  };
};
