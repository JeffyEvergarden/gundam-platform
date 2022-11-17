import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { Button, Popconfirm, Tabs, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import AuditionModal from './component/auditionModal';
import ReplaceModal from './component/replaceModal';
import TablePage from './component/tablePage';
import { useSoundModel } from './model';
import style from './style.less';

const { TabPane } = Tabs;

const SoundRecord: React.FC = (props: any) => {
  const [activeKey, setActiveKey] = useState('1');
  const tableRef = useRef<any>();
  const tableRef2 = useRef<any>();
  const tableRef3 = useRef<any>();
  const tableRef4 = useRef<any>();
  const auditionRef = useRef<any>();
  const replaceRef = useRef<any>();

  const { getTableList, deleteSound, loading, opLoading, tableList } = useSoundModel();

  const columns: any = [
    {
      title: '录音名称',
      dataIndex: 'name',
      fixed: 'left',
      fieldProps: {
        placeholder: '请输入录音名称',
      },
      ellipsis: true,
      width: 180,
    },
    {
      title: activeKey == '1' || activeKey == '3' ? '应用节点' : '应用FAQ',
      dataIndex: 'applyNames',
      fieldProps: {
        placeholder: activeKey == '1' || activeKey == '3' ? '请输入应用节点' : '请输入应用FAQ',
      },
      width: 200,
      ellipsis: true,
      render: (v: any, r: any, i: any) => {
        return (
          <div>
            <div className={style['applyNode']}>{`${1}.${r?.applyNames?.[0]}`}</div>
            <Tooltip
              title={
                <div key={i}>
                  {r?.applyNames.map((item: any, index: any) => (
                    <div key={index + item}>{`${index + 1}.${item}`}</div>
                  ))}
                </div>
              }
            >
              <span style={{ color: '#1890ff' }}>查看更多</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '转写文本',
      dataIndex: 'text',
      fieldProps: {
        placeholder: '请输入转写文本',
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      width: activeKey == '1' || activeKey == '2' ? 200 : 100,
      render: (v: any, r: any, i: any) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                auditionRef.current?.open?.(r);
              }}
            >
              试听
            </Button>

            <Button
              type="link"
              onClick={() => {
                // labelModalRef.current?.open?.(row);
              }}
            >
              下载
            </Button>
            <Condition r-if={activeKey == '1' || activeKey == '2'}>
              <Button
                type="link"
                onClick={() => {
                  replaceRef.current?.open?.(r, 'edit');
                }}
              >
                替换
              </Button>

              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  deleteSound({ id: r.id }).then((res: any) => {
                    if (res) {
                      refresh();
                    }
                  });
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </Condition>
          </div>
        );
      },
    },
  ];

  const refresh = () => {
    if (activeKey == '1') {
      (tableRef?.current as any)?.refresh();
    }
    if (activeKey == '2') {
      (tableRef2?.current as any)?.refresh();
    }
    if (activeKey == '3') {
      (tableRef3?.current as any)?.refresh();
    }
    if (activeKey == '4') {
      (tableRef4?.current as any)?.refresh();
    }
  };

  const OperationsSlot = () => ({
    right: <Tip title={'录音管理用于上传录音，及查看录音或TTS合成的录音被应用的状态。'}></Tip>,
  });

  useEffect(() => {
    refresh();
  }, [activeKey]);

  return (
    <div className="list-page">
      <Tabs
        defaultActiveKey="1"
        size={'large'}
        style={{ width: '100%', backgroundColor: '#fff', paddingLeft: '10px', marginBottom: 0 }}
        onChange={setActiveKey}
        activeKey={activeKey}
        tabBarExtraContent={OperationsSlot()}
        className={style['tabsTop']}
      >
        <TabPane tab="流程节点录音" key="1">
          <TablePage cref={tableRef} activeKey={1} />
        </TabPane>
        <TabPane tab="FAQ录音" key="2">
          <TablePage cref={tableRef2} activeKey={2} />
        </TabPane>
        <TabPane tab="节点-TTS" key="3">
          <TablePage cref={tableRef3} activeKey={3} />
        </TabPane>
        <TabPane tab="FAQ-TTS" key="4">
          <TablePage cref={tableRef4} activeKey={4} />
        </TabPane>
      </Tabs>

      <AuditionModal cref={auditionRef}></AuditionModal>
      <ReplaceModal cref={replaceRef} refresh={refresh}></ReplaceModal>
    </div>
  );
};

export default SoundRecord;
