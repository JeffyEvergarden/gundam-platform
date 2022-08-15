import config from '@/config/index';
import { request } from '@/services/request';

const baseUrl: string = config.basePath;

/** 获取机器人配置信息 **/
export async function getConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/configInfo`, {
    method: 'POST',
    data,
  });
}

/** 编辑机器人配置信息 **/
export async function editConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/configUpdate`, {
    method: 'POST',
    data,
  });
}

/** 接口配置分页列表 **/
export async function getInterfaceCurrentList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/listPage`, {
    method: 'GET',
    params,
  });
}

/** 接口配置列表 **/
export async function getInterfaceList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/list`, {
    method: 'GET',
    params,
  });
}

/** 接口配置详情 **/
export async function getInterfaceDetail(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/interface/param`, {
    method: 'GET',
    params,
  });
}

/** 变量配置分页列表 **/
export async function getConfigCurrentList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/listPage`, {
    method: 'GET',
    params,
  });
}

/** 变量配置新增 **/
export async function addNewGlobal(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/add`, {
    method: 'POST',
    data,
  });
}

/** 变量配置编辑 **/
export async function editNewGlobal(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/update`, {
    method: 'POST',
    data,
  });
}

/** 变量配置编辑 **/
export async function deleteGlobal(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/del`, {
    method: 'POST',
    data,
  });
}

/** 获取全局节点信息 **/
export async function _getNodeConfig(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/getOverConfig`, {
    method: 'GET',
    params,
  });
}

/** 提交全局节点信息 **/
export async function _saveNode(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/node/overConfig`, {
    method: 'POST',
    data,
  });
}

// 获取faq配置
export async function getFAQList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/list`, {
    method: 'GET',
    params,
  });
}

// 获取faq配置
export async function _editFAQ(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/updateList`, {
    method: 'POST',
    data,
  });
}

// 获取拒识配置
export async function getRejectFAQList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/getRejectRecommend`, {
    method: 'GET',
    params,
  });
}

// 编辑拒识配置
export async function _editRejectFAQ(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/config/updateRejectRecommend`, {
    method: 'POST',
    data,
  });
}

export async function getChannelConfigList(params?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/channel/list`, {
    method: 'GET',
    params,
  });
}

export async function addNewChannelConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/channel/add`, {
    method: 'POST',
    data,
  });
}

export async function editChannelConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/channel/update`, {
    method: 'POST',
    data,
  });
}

export async function deleteChannelConfig(data?: { [key: string]: any }) {
  return request(`${baseUrl}/robot/channel/delete`, {
    method: 'POST',
    data,
  });
}
