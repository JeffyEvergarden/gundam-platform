import Tip from '@/components/Tip';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { useModel } from 'umi';
import EvaluationDetail from '../component/evaluationDetail';
import EvaluationModal from '../component/evaluationModal';
import { useEvaluationModel } from '../model';
import style from '../sampleManager/style.less';

const DetailPages: React.FC = (props: any) => {
  const TableRef = useRef<any>({});
  const ModalRef = useRef<any>({});
  const DetailRef = useRef<any>({});

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const { getList, addEvaluation, getResultList, deleteEvaluation } = useEvaluationModel();

  const columns: any[] = [
    {
      title: '所用评估表',
      dataIndex: 'sampleSetName',
      search: false,
      fixed: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: '评估时间',
      dataIndex: 'createTime',
      search: false,
      width: 200,
      ellipsis: true,
      render: (val: any, row: any) => {
        return val;
      },
    },
    {
      title: '提交人',
      dataIndex: 'creator',
      search: false,
      width: 200,
    },
    {
      title: () => (
        <>
          {'平均精确率'}
          <Tip
            title={
              '各条样本精确率的平均值。假设三条样本的精确率分别是70%、80%、90%，则平均精确率=（70%+80%+90%）/ 3'
            }
          />
        </>
      ),
      dataIndex: 'averageAccurateRate',
      search: false,
      width: 200,
    },
    {
      title: () => (
        <>
          {'平均召回率'}
          <Tip
            title={
              '各条样本召回率的平均值。假设三条样本的召回率分别是70%、80%、90%，则平均召回率=（70%+80%+90%）/ 3'
            }
          />
        </>
      ),
      dataIndex: 'averageRecallRate',
      search: false,
      width: 200,
    },
    {
      title: () => (
        <>
          {'阈值'}
          <Tip
            title={
              '控制模型评估时，调用NLU返回的结果类型，低于阈值为“拒识”，高于阈值且只有1个候选为“明确回复”，高于阈值且候选多于1个且差值小于得分差值时触发“澄清”。'
            }
          />
        </>
      ),
      dataIndex: 'threshold',
      search: false,
      width: 200,
    },
    {
      title: () => (
        <>
          {'差值'}
          <Tip
            title={
              '模型评估时，调用NLU返回的结果类型，高于阈值且候选多于1个且差值小于得分差值时触发“澄清”。'
            }
          />
        </>
      ),
      dataIndex: 'difference',
      search: false,
      width: 200,
    },
    {
      title: () => (
        <>
          {'澄清数量'}
          <Tip
            title={'控制模型评估时，调用NLU返回的结果控制触发澄清时，选取多少个候选进行澄清。'}
          />
        </>
      ),
      dataIndex: 'clarifyNum',
      search: false,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 150,
      render: (val: any, row: any, index: number) => {
        if (row.assessStatus == 2) {
          return (
            <div style={{ display: 'flex' }}>
              <Button
                type="link"
                onClick={() => {
                  DetailRef.current?.open?.(row);
                }}
              >
                查看详情
              </Button>

              <Popconfirm
                title="删除将不可恢复，确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={async () => {
                  await deleteEvaluation({ robotId: info.id, id: row.id }).then((res) => {
                    if (res) {
                      TableRef?.current?.reload();
                    }
                  });
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </div>
          );
        } else if (row.assessStatus == 1) {
          return <div className={style['btn']}>评估中</div>;
        } else if (row.assessStatus == 0) {
          return <div className={style['btn']}>待评估</div>;
        } else if (row.assessStatus == 3) {
          return <div className={style['btn']}>评估失败</div>;
        }
      },
    },
  ];

  return (
    <div className={`${style['machine-page']} list-page`}>
      <ProTable<any>
        columns={columns}
        actionRef={TableRef}
        scroll={{ x: columns.length * 200 }}
        request={async (params = {}, sort, filter) => {
          return getList({
            robotId: info.id,
            page: params.current,
            ...params,
          });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-machine-list',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={false}
        form={{
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle={
          <>
            {'模型评估列表'}
            <Tip
              title={'调用机器人对话接口意图识别流程（黑名单、澄清列表、NLU），评估样本集的效果。'}
            />
          </>
        }
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => {
              ModalRef.current?.open?.();
            }}
          >
            提交评估
          </Button>,
        ]}
      />

      <EvaluationDetail cref={DetailRef}></EvaluationDetail>
      <EvaluationModal
        cref={ModalRef}
        refresh={() => {
          TableRef?.current?.reload();
        }}
      ></EvaluationModal>
    </div>
  );
};

export default DetailPages;
