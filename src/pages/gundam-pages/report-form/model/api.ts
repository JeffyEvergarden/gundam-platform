import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

/** 访客次数统计 **/
export async function visitorList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/visitor`, {
    method: 'GET',
    params,
  });
}

/** 访客会话明细**/
export async function session(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/session`, {
    method: 'GET',
    params,
  });
}
/** 问题匹配率**/
export async function questionMatch(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/questionMatch`, {
    method: 'GET',
    params,
  });
}

/** 问题匹配率-拒识**/
export async function reject(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/questionMatch/rejectRateDetail`, {
    method: 'GET',
    params,
  });
}

/** 推荐问和澄清**/
export async function faqAndClareList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/faqAndClarify`, {
    method: 'GET',
    params,
  });
}

/** 联想**/
export async function searchAssociationList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/suggest`, {
    method: 'GET',
    params,
  });
}

/** 客户轨迹**/
export async function searchCustomerTrackList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/customerTrack`, {
    method: 'GET',
    params,
  });
}

/** 访客问题统计**/
export async function searchvisitorsQuestionList(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/access`, {
    method: 'POST',
    data,
  });
}

/** 访客问题统计 导出样本**/
export async function _visitorsQuestionSampleExport(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/accessSessionExport`, {
    method: 'POST',
    data,
    responseType: 'blob',
    parseResponse: false,
  });
}

/** 访客问题统计 导出报表**/
export async function _visitorsQuestionExport(data?: Record<string, any>) {
  return request(`${baseUrl}/robot/statistics/accessExport`, {
    method: 'POST',
    data,
    responseType: 'blob',
    parseResponse: false,
  });
}
