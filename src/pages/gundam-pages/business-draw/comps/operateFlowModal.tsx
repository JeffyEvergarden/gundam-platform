import Tip from '@/components/Tip';
import config from '@/config/index';
import { Form, Input, message, Modal, Select, Space, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import { operateFlowFormList } from '../config';
import { useTableModel } from '../model';
import style from './style.less';

const { Option } = Select;
const selectOptList = [
  {
    name: '意图',
    value: 'intent',
  },
];

const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};

export default (props: any) => {
  const { visible, title, modalData, operateFunc } = props;
  const [form] = Form.useForm();
  const [spinning, handleSpinning] = useState<boolean>(false);
  const [disabledNum, setDisableNum] = useState<any>(null);
  const flowNameWatch = Form.useWatch('flowName', form);

  const { editFlowData, addFlowData } = useTableModel();
  const { _wishList, getWishList } = useModel('drawer' as any, (model: any) => ({
    _wishList: model._wishList || [],
    getWishList: model.getWishList, // 业务流程列表
  }));

  const wishListArr = useMemo(() => {
    const tempIntent = _wishList.filter((item: any) => item.headIntent !== 1);
    return tempIntent;
  }, [_wishList]);

  useEffect(() => {
    if (visible) {
      // getIntentSelList();
      getWishList(modalData?.robotId);
      if (title == 'edit') {
        handleSpinning(true);
        setDisableNum(modalData.headIntent);
        form.setFieldsValue({ ...modalData });
        handleSpinning(false);
      }
    }
  }, [visible]);
  const closeModal = () => {
    operateFunc();
    form.resetFields();
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (!values) {
      return;
    }
    const data = form.getFieldsValue();
    let params = {
      ...data,
      robotId: modalData.robotId,
    };
    let res: any;
    handleSpinning(true);
    if (title == 'edit') {
      res = await editFlowData({ ...params, id: modalData.id });
    } else {
      res = await addFlowData({ ...params, flowType: 1 });
    }
    if (res?.resultCode == config.successCode) {
      message.info(res?.resultDesc);
      operateFunc();
      form.resetFields();
      getWishList(modalData?.robotId, true);
    } else {
      message.info(res?.resultDesc || '失败');
    }
    handleSpinning(false);
  };

  useEffect(() => {
    console.log(flowNameWatch);
    if (flowNameWatch == '知识问答') {
      form.setFieldsValue({ headIntent: undefined });
    }
  }, [flowNameWatch]);

  return (
    <React.Fragment>
      <Modal
        width={650}
        visible={visible}
        title={title == 'edit' ? '编辑' : '新增'}
        onCancel={closeModal}
        onOk={submit}
      >
        <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
          <Spin spinning={spinning}>
            <Form form={form} style={{ width: '360px' }}>
              {operateFlowFormList?.map((item: any) => {
                return (
                  <React.Fragment key={item.name}>
                    {item.type == 'input' && (
                      <Form.Item name={item.name} label={item.label} rules={item.rules}>
                        <Input
                          maxLength={150}
                          placeholder={item.placeholder}
                          disabled={item.name == 'flowName' && modalData?.flowType == '3'}
                        />
                      </Form.Item>
                    )}
                    {item.type == 'select' && (
                      <Form.Item label={item.label}>
                        <Space align={'baseline'}>
                          <Form.Item name={item.name} noStyle rules={item.rules}>
                            <Select
                              style={{ width: '260px' }}
                              placeholder={item.placeholder}
                              allowClear
                              disabled={flowNameWatch == '知识问答'}
                            >
                              {wishListArr?.map((itex: any, index: number) => {
                                return (
                                  <Option
                                    key={itex.name}
                                    value={itex.name}
                                    opt={itex}
                                    disabled={
                                      disabledNum == itex.name
                                        ? false
                                        : itex.connect == 1
                                        ? true
                                        : false
                                    }
                                  >
                                    {itex.label}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Tip
                            title={
                              '用户触发进入业务流程的头部意图。例如配置“转人工业务流程“，用于将对话转交给人工，可以在“触发意图”中选用“转人工”头部意图。其中“转人工”意图中配置有“帮我转人工”、“我要人工客服”类似的语料，当客户要求转人工时，命中“转人工”头部意图，则进入对应的业务流程进行处理。'
                            }
                          />
                        </Space>
                      </Form.Item>
                    )}
                  </React.Fragment>
                );
              })}
            </Form>
          </Spin>
        </div>
      </Modal>
    </React.Fragment>
  );
};
