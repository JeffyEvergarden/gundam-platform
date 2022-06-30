import { request } from '@/services/request';
import config from '@/config/index';
const baseUrl: string = config.basePath;

export async function intentRulePageList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentRulePageList`, {
    method: 'GET',
    params,
  });
}

export async function slotList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/slot/slotInfo`, {
    method: 'POST',
    data: params,
  });
}

export async function featureListAll(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentFeatureList`, {
    method: 'GET',
    params,
  });
}

export async function intentFeaturePageList(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentFeaturePageList`, {
    method: 'GET',
    params,
  });
}

export async function addRule(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentRuleAdd`, {
    method: 'POST',
    data: params,
  });
}

export async function intentRuleEdit(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentRuleEdit`, {
    method: 'POST',
    data: params,
  });
}
export async function intentMoveRule(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentRuleMove`, {
    method: 'POST',
    data: params,
  });
}

export async function ruledelete(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentRuleDelete`, {
    method: 'POST',
    data: params,
  });
}

export async function addFeature(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentFeatureAdd`, {
    method: 'POST',
    data: params,
  });
}

export async function editFeature(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentFeatureEdit`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteFeatures(params?: Record<string, any>) {
  return request(`${baseUrl}/robot/intent/intentFeatureDelete`, {
    method: 'POST',
    data: params,
  });
}
