import { Request, Response } from 'express';

const successCode = '100';

const getMenuList = (req: any, res: any) => {
  res.json({
    code: 200,
    data: [
      {
        name: '管理大屏',
        key: '0',
        type: '1',
        parentId: '100',
        subMenu: [
          {
            name: '业务类',
            key: '0-0',
            isLeaf: true,
            child: [
              {
                name: 'baidu',
                key: '0-0-0',
              },
              {
                name: 'bilibili',
                key: '0-0-1',
              },
              {
                name: 'fake',
                key: '0-0-2',
              },
            ],
          },
          {
            name: '经验分析类',
            key: '0-1',
            isLeaf: true,
            icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
            child: [
              {
                name: 'baidu',
                key: '0-1-0',
              },
              {
                name: 'bilibili',
                key: '0-1-1',
              },
              {
                name: 'fake',
                key: '0-1-2',
              },
            ],
          },
          {
            name: '分险欺诈类',
            key: '0-2',
            isLeaf: true,
            parentId: '100000',
            child: [
              {
                name: 'baidu',
                key: '0-2-0',
              },
              {
                name: 'bilibili',
                key: '0-2-1',
              },
              {
                name: 'fake',
                key: '0-2-2',
              },
            ],
          },
        ],
      },
      {
        name: 'fuck大屏',
        key: '2',
        type: '1',
        subMenu: [],
      },
      {
        name: '分析业务',
        key: '1',
        subMenu: [
          {
            name: '阳光',
            key: '1-0',
            isLeaf: true,
            child: [
              {
                name: 'baidu',
                key: '0-0-0',
              },
              {
                name: 'bilibili',
                key: '0-0-1',
              },
              {
                name: 'fake',
                key: '0-0-2',
              },
            ],
          },
          {
            name: '太阳',
            key: '1-1',
            isLeaf: true,
            child: [
              {
                name: 'baidu',
                key: '0-1-0',
              },
              {
                name: 'bilibili',
                key: '0-1-1',
              },
              {
                name: 'fake',
                key: '0-1-2',
              },
            ],
          },
          {
            name: '月亮',
            key: '1-2',
            isLeaf: true,
            child: [
              {
                name: 'baidu',
                key: '0-2-0',
              },
              {
                name: 'bilibili',
                key: '0-2-1',
              },
              {
                name: 'fake',
                key: '0-2-2',
              },
            ],
          },
        ],
      },
    ],
  });
};

const getIpList = (req: any, res: any) => {
  res.json({
    code: successCode,
    total: 200,
    data: {
      total: 200,
      records: [
        {
          id: 1,
          ip: '20.20.110.123',
        },
        {
          id: 2,
          ip: '20.20.110.123',
        },
        {
          id: 3,
          ip: '20.20.110.123',
        },
        {
          id: 4,
          ip: '20.20.110.123',
        },
        {
          id: 5,
          ip: '20.20.110.123',
        },
        {
          id: 6,
          ip: '20.20.110.123',
        },
        {
          id: 7,
          ip: '20.20.110.123',
        },
        {
          id: 8,
          ip: '20.20.110.123',
        },
        {
          id: 9,
          ip: '20.20.110.123',
        },
        {
          id: 10,
          ip: '20.20.110.123',
        },
        {
          id: 11,
          ip: '20.20.110.123',
        },
        {
          id: 12,
          ip: '20.20.110.123',
        },
      ],
    },
  });
};

const getCurrentMenuList = (req: any, res: any) => {
  res.json({
    code: 200,
    data: [
      {
        id: 'fake13',
        name: 'fuck3',
        url: 'https://www.baidu.com',
        showType: 'leader',
        index: 10,
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
      },
      {
        id: 'fake2',
        name: 'fuck2',
        url: 'https://www.baidu.com',
        showType: 1,
        index: 10,
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
      },
      {
        id: 'fake',
        name: 'fuck1',
        url: 'https://www.baidu.com',
        showType: 1,
        index: 10,
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
      },
      {
        id: 'fake',
        name: 'fuck4',
        url: 'https://www.baidu.com',
        showType: 'leader',
        index: 10,
        icon: '',
      },
      {
        id: 'fake',
        name: 'fuck5',
        url: 'https://www.baidu.com',
        showType: 'leader',
        index: 10,
        icon: 'https://10.192.171.243:8099/unifyportal/menuFile/get?id=1464173559804456961',
      },
      {
        id: 'fake',
        name: 'fuck6',
        url: 'https://www.baidu.com',
        showType: 'leader',
        index: 10,
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
      },
      {
        id: 'fake',
        name: 'fuck7',
        url: 'https://www.baidu.com',
        showType: 'leader',
        index: 10,
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
      },
    ],
  });
};

const addIp = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {
      ip: 10,
    },
  });
};

const deleteIp = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {},
  });
};

const addNewLink = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {
      id: 'fake',
      name: 'fuck',
      url: 'https://www.baidu.com',
      showType: 'leader',
      index: 10,
      icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-6ff5d5ccc24154bc38823529d353d474_hd.jpg&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640501958&t=c76186c40a5a100e12e94f92bf77bd62',
    },
  });
};

const deleteLink = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {},
  });
};

const updateLink = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {
      id: 10,
      name: 'fasdasdadad',
    },
  });
};

const getFormInfo = (req: any, res: any) => {
  res.json({
    code: successCode,
    data: {
      isDisplay: true,
      oldUrl: 'https://www.baidu.com',
    },
  });
};

// 菜单管理相关
export default {
  // 菜单管理相关
  'GET /bdp/unifyportal/menu/getBackstageTreeList': getMenuList, // 获取所有模块
  'GET /bdp/unifyportal/menu/getListByParentId': getCurrentMenuList, // 获取当前子模块
  'POST /bdp/unifyportal/menu/addSubmodule': addNewLink, // 添加模块
  'POST /bdp/unifyportal/menu/deleteMenu`': deleteLink, // 删除模块
  'POST /bdp/unifyportal/menu/updateSubmodule': updateLink, // 修改模块
  'POST /bdp/unifyportal/menu/addModule': addNewLink, // 添加模块
  'POST /bdp/unifyportal/menu/deleteMenu': deleteLink, // 删除模块
  'POST /bdp/unifyportal/menu/updateModule': updateLink, // 修改模块
  'POST /bdp/unifyportal/menu/updateModuleTree': updateLink,
  // 白名单ip相关 ----
  'GET /bdp/unifyportal/ipBind/pageIpBind': getIpList,
  'POST /bdp/unifyportal/ipBind/addIpBind': addIp,
  'POST /bdp/unifyportal/ipBind/deleteIpBind': deleteIp,
  'POST /bdp/unifyportal/ipBind/putIpBind': addIp,
  // 基础通用表单配置----
  'GET /bdp/unifyportal/oldHome/getOldHome': getFormInfo,
  'POST /bdp/unifyportal/oldHome/addOldHome': updateLink,
};
