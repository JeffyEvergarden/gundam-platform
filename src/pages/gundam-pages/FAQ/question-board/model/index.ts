import {
  addQuestion,
  editQuestion,
  getQuestionInfo,
  addAnswer,
  editAnswer,
  getAnswerInfo,
} from './api';
import { message } from 'antd';
import config from '@/config';
const successCode = config.successCode;

export const useQuestionModel = () => {
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
    addNewQuestion,
    updateQuestion,
    getQuestionInfo: _getQuestionInfo,
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

  return {
    addNewAnswer,
    updateAnswer,
    getAnswerInfo: _getAnswerInfo,
  };
};
