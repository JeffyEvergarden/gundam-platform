import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, Tag, message } from 'antd';
import { uuid2 } from '@/uitils';
import RuleDecriModal from './ruleModal';
import styles from './index.less';

const { TextArea } = Input;
const tailLayout = {
  wrapperCol: { offset: 8, span: 12 },
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
export default (props: any) => {
  const { type, visible, editObj, onCancel, save } = props;
  const [form] = Form.useForm();
  const [ruleList, setRulist] = useState<any>([]);
  const [ruleVisible, setRuleVisible] = useState<boolean>(false);
  const [ruleEditData, setRuleEditData] = useState<any>({});
  const [operate, setOperate] = useState<string>('');

  useEffect(() => {
    setRulist(editObj?.entityValueList || []);
  }, [editObj, visible]);
  const addRule = () => {
    setRuleEditData({});
    setRuleVisible(true);
    setOperate('add');
  };

  const handleClose = (entityValueName: string) => {
    const tags = ruleList.filter((item: any) => item.entityValueName !== entityValueName);
    setRulist(tags);
  };

  const editRule = (item: any) => {
    setRuleEditData(item);
    setRuleVisible(true);
    setOperate('edit');
  };

  const closeRuleDecri = () => {
    setRuleVisible(false);
  };
  const cancelZZ = () => {
    onCancel();
    form.resetFields();
  };

  const handle = (values: any) => {
    let temp = [...ruleList];
    if (operate === 'edit') {
      temp.map((item: any) => {
        if (item.entityValueName === ruleEditData.entityValueName) {
          item.entityValueName = values.entityValueName;
          item.entityValue = values.entityValue;
        }
      });
    }
    if (operate === 'add') {
      for (let i = 0; i < temp?.length; i++) {
        if (temp[i].entityValueName === values.entityValueName) {
          message.warning('已有该规则列表名称');
          return;
        }
      }
      temp.push(values);
    }
    setRulist(temp);
  };

  const submit = async () => {
    const values = await form.validateFields();
    let para = {
      robotId: localStorage.getItem('robot_id'),
      ...values,
      entityValueList: [...ruleList],
    };
    save(para, operate);
  };

  return (
    <Fragment>
      <Modal
        visible={visible}
        title={type === 'edit' ? '编辑正则实体' : '新增正则实体'}
        footer={null}
        onCancel={cancelZZ}
        destroyOnClose={true}
      >
        <Form
          form={form}
          {...layout}
          initialValues={{ entityName: editObj?.entityName, entityDesc: editObj?.entityDesc }}
        >
          <Form.Item
            name={'entityName'}
            label={'正则实体'}
            rules={[{ required: true, message: '请输入正则实体名称' }]}
          >
            <Input placeholder={'请输入正则实体名称'} maxLength={150} readOnly={type === 'edit'} />
          </Form.Item>
          <Form.Item name={'entityDesc'} label={'说明'}>
            <TextArea placeholder={'请输入正则实体说明'} rows={4} />
          </Form.Item>
          <Form.Item
            label={'规则列表'}
            name={'ruleList'}
            // rules={[{ required: true, message: '请添加规则列表' }]}
          >
            <div className={styles.ruleListBox}>
              <div className={styles.listBox}>
                {ruleList.map((item: any) => {
                  return (
                    <Tag closable key={item.ID} onClose={() => handleClose(item.entityValueName)}>
                      <span onDoubleClick={() => editRule(item)}>{item.entityValueName}</span>
                    </Tag>
                  );
                })}
              </div>
              <Button type="primary" size={'small'} onClick={addRule}>
                新建规则
              </Button>
            </div>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button onClick={cancelZZ}>取消</Button>
              <Button type="primary" onClick={submit}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <RuleDecriModal
        ruleVisible={ruleVisible}
        ruleEditData={ruleEditData}
        closeRuleDecri={closeRuleDecri}
        handle={handle}
        operate={operate}
      />
    </Fragment>
  );
};
