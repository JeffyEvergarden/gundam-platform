import { Request, Response } from 'express';

const successCode = '000000';

const getList = (req: any, res: any) => {
  res.json({
    code: successCode,
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

// 菜单管理相关
export default {
  // 机器人管理相关
  'GET /machine/list': getList, // 获取所有模块
};
