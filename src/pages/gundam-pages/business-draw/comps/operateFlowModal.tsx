import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, Select, Space, Button, message, Spin } from 'antd';
import { operateFlowFormList } from '../config';
import { useTableModel } from '../model';
import style from './style.less';
import { useModel } from 'umi';

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
    if (res?.resultCode == '0000') {
      message.info(res?.resultDesc);
      operateFunc();
      form.resetFields();
      getWishList(modalData?.robotId, true);
    } else {
      message.info(res?.resultDesc || '失败');
    }
    handleSpinning(false);
  };

  return (
    <React.Fragment>
      <Modal
        width={650}
        visible={visible}
        title={title == 'edit' ? '编辑' : '新增'}
        onCancel={closeModal}
        onOk={submit}
        footer={null}
      >
        <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
          <Spin spinning={spinning}>
            <Form form={form} style={{ width: '360px' }}>
              {operateFlowFormList?.map((item: any) => {
                return (
                  <React.Fragment key={item.name}>
                    {item.type == 'input' && (
                      <Form.Item
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={{ width: '360px' }}
                      >
                        <Input maxLength={150} placeholder={item.placeholder} />
                      </Form.Item>
                    )}
                    {item.type == 'select' && (
                      <Form.Item
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={{ width: '360px' }}
                      >
                        <Select placeholder={item.placeholder}>
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
                    )}
                  </React.Fragment>
                );
              })}

              <Form.Item {...tailLayout}>
                <Space>
                  <Button onClick={closeModal}>取消</Button>
                  <Button type="primary" onClick={submit}>
                    确认
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </React.Fragment>
  );
};
