import React, { useState } from 'react';
import { Button, Input, Select, Space, Tree, Collapse, List, Divider } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import HighConfigSelect from './components/high-select';
import style from './style.less';
import { treeData } from './test';

const { Panel } = Collapse;
const { Option } = Select;

const FAQPage: React.FC<any> = (props: any) => {
  const onSelect = (val: any) => {
    console.log('选择树形组件:' + val);
  };

  const [value, setValue] = useState<any>({
    channel: 0,
    status: 0,
    sort: 0,
    creator: [0],
  });

  const changeHighConfig = (val: any) => {
    setValue(val);
  };

  const list: any[] = [
    {
      name: '阿斯拉大',
      email: 'ljk15916807596@qq.com',
      content: '冲啊，旋风冲锋',
      time: '2022-04-01 14:00:00',
      channel: ['微信', 'API', 'APP'],
      creator: '伟大的教团',
      times: 100,
    },
  ];

  const extraBtnHtml = <SettingOutlined />;

  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <Space>
            <Button type="primary">添加问题</Button>

            <Button type="primary">分类管理</Button>

            <Button type="primary">批量倒入</Button>
          </Space>
        </div>

        <div className={style['page_top__right']}>
          <Space>
            <Input.Group compact>
              <Input style={{ width: '280px' }} defaultValue="钢铁是怎么炼成的" />
              <Select defaultValue={1}>
                <Option value={1}>问题</Option>
                <Option value={2}>答案</Option>
                <Option value={3}>标签</Option>
              </Select>
            </Input.Group>

            <Button type="primary">问题回收站</Button>
          </Space>
        </div>
      </div>

      <div className={style['page_content']}>
        <div className={style['main-content_left']}>
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            onSelect={onSelect}
            treeData={treeData}
          ></Tree>
        </div>
        <div className={style['main-content']}>
          <div className={style['high-config-select']}>
            <Collapse>
              <Panel header="问答列表" key="1" extra={extraBtnHtml}>
                <HighConfigSelect value={value} onChange={changeHighConfig} />
              </Panel>
            </Collapse>
          </div>
          <div className={style['content']}>
            <List
              itemLayout="vertical"
              dataSource={list}
              renderItem={(item: any, index: number) => {
                const channel: any = item.channel || [];

                return (
                  <List.Item key={index}>
                    <div className={style['list-item']}>
                      <div className={style['box-top']}>
                        <div className={style['title']}>{item.name}</div>
                        <div className={style['extra']}>{item.time}</div>
                      </div>
                      <div className={style['box-desc']}>补充信息</div>
                      <div
                        className={style['box-content']}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      ></div>
                      <div className={style['box-footer']}>
                        <div>
                          <span>作者: {item.creator}</span>
                          <Divider type="vertical" />
                          <span>
                            生效渠道: <span className={style['blue']}>{channel.join(',')}</span>
                          </span>
                          <Divider type="vertical" />
                          <span>浏览次数: {item.times}</span>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            ></List>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
