import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Modal, Row, Select, Tooltip } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { useEvaluationModel } from '../../model';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const EvaluationDetail: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;
  const TableRef = useRef<any>({});

  const { resultData, getResultList } = useEvaluationModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  // const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [nluInfo, setNluInfo] = useState<string>('');
  const temRef = useRef<any>();

  const close = () => {
    TableRef?.current?.reset();
    // form.resetFields();
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      temRef.current = row;
      setVisible(true);
      setTimeout(() => {
        TableRef?.current?.reload?.();
      }, 100);
    },
    close,
  }));

  const columns: any[] = [
    {
      title: '评估样本',
      dataIndex: 'dialogueSample',
      fieldProps: {
        placeholder: '请输入评估样本',
      },
      fixed: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: '标注回复类型',
      dataIndex: 'tagReplyType',
      search: false,
      width: 150,
      ellipsis: true,
      valueEnum: {
        1: { text: '明确回复' },
        2: { text: '澄清回复' },
        3: { text: '拒识回复' },
      },
    },
    {
      title: '标注FAQ/意图',
      dataIndex: 'tagFaqIntent',
      search: false,
      width: 200,
      render: (val: any, row: any) => {
        let arr = row?.tagFaqIntent;
        if (Array.isArray(arr)) {
          return (
            <div className={style['question-box']}>
              {arr.map((item: any, i: number) => {
                return (
                  <Tooltip title={item} placement={'topLeft'} key={i}>
                    <div className={style['qustion-label']} key={i}>
                      {item}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          );
        } else {
          return '---';
        }
      },
    },
    {
      title: '识别回复类型',
      dataIndex: 'distinguishReplyType',
      search: false,
      width: 150,
      valueEnum: {
        1: { text: '明确回复' },
        2: { text: '澄清回复' },
        3: { text: '拒识回复' },
      },
    },
    {
      title: '识别FAQ/意图',
      dataIndex: 'distinguishFaqIntent',
      search: false,
      width: 200,
      render: (val: any, row: any) => {
        let arr = row?.distinguishFaqIntent;
        if (Array.isArray(arr)) {
          return (
            <div className={style['question-box']}>
              {arr.map((item: any, i: number) => {
                return (
                  <Tooltip title={item} placement={'topLeft'} key={i}>
                    <div className={style['qustion-label']} key={i}>
                      {item}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          );
        } else {
          return '---';
        }
      },
    },
    {
      title: '精准率',
      dataIndex: 'accurateRate',
      search: false,
      width: 150,
    },
    {
      title: '召回率',
      dataIndex: 'recallRate',
      search: false,
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 130,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                detail(row.nluReturn);
              }}
            >
              查看详情
            </Button>
          </div>
        );
      },
    },
  ];

  const detail = (nluInfo: string) => {
    if (nluInfo) {
      let temp = JSON?.parse?.(nluInfo);
      temp = JSON?.stringify?.(temp, null, 2);
      setNluInfo(temp);
    }

    setDetailVisible(true);
  };

  return (
    <Modal
      width={'80%'}
      title={`评估详情`}
      visible={visible}
      onCancel={() => {
        close();
      }}
      footer={false}
      destroyOnClose={true}
    >
      <div className={style['info']}>
        <Row>
          <Col span={8}>评估集名称：{resultData?.sampleSetName || '-'}</Col>
          <Col span={8}>平均精准率：{resultData?.averageAccurateRate || '-'}</Col>
          <Col span={8}> 样本数量：{resultData?.sampleNum || '-'} </Col>
        </Row>
        <Row>
          <Col span={8}>评估时间：{resultData?.assessTime || '-'}</Col>
          <Col span={8}>平均召回率：{resultData?.averageRecallRate || '-'}</Col>
          <Col span={8}>有效样本数量：{resultData?.effectiveSampleNum || '-'}</Col>
        </Row>
      </div>
      <div className={`${style['machine-page']} list-page`}>
        <ProTable<any>
          columns={columns}
          actionRef={TableRef}
          scroll={{ x: columns.length * 200 }}
          request={async (params = {}, sort, filter) => {
            return getResultList({
              robotId: info.id,
              page: params.current,
              modelAssessId: temRef?.current?.id || undefined,
              ...params,
            });
            return {};
          }}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-machine-list',
            persistenceType: 'localStorage',
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          pagination={{
            pageSize: 10,
          }}
          dateFormatter="string"
          // headerTitle="模型评估列表"
          toolBarRender={() => []}
        />
        <Modal
          title={'详情'}
          visible={detailVisible}
          onCancel={() => {
            setNluInfo('');
            setDetailVisible(false);
          }}
          footer={null}
          bodyStyle={{ maxHeight: 600, overflowY: 'auto' }}
        >
          <pre> {nluInfo}</pre>
        </Modal>
      </div>
    </Modal>
  );
};

export default EvaluationDetail;
