import React, { Fragment, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Modal, Form, Input, Button, Space, Tag, message } from 'antd';
import RuleDecriModal from './ruleModal';
import styles from './index.less';

const { TextArea } = Input;

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

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  useEffect(() => {
    setRulist(editObj?.entityValueList || []);
    form.setFieldsValue({ entityName: editObj?.entityName, entityDesc: editObj?.entityDesc });
  }, [visible]);

  const addRule = () => {
    setRuleEditData({});
    setRuleVisible(true);
    setOperate('add');
  };

  const handleClose = (entityValueName: string) => {
    let temp = JSON.parse(JSON.stringify(ruleList));
    const tags = temp.filter((item: any) => item.entityValueName !== entityValueName);
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
    // form.resetFields();
  };

  const handle = (values: any) => {
    let temp = JSON.parse(JSON.stringify(ruleList));
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
      robotId: info.id,
      ...values,
      entityValueList: [...ruleList],
    };
    save(para, 1, type);
  };

  return (
    <Fragment>
      <Modal
        visible={visible}
        title={type === 'edit' ? '编辑正则实体' : '新增正则实体'}
        okText={'提交'}
        onOk={submit}
        onCancel={cancelZZ}
        destroyOnClose={true}
      >
        <Form form={form} {...layout}>
          <Form.Item
            name={'entityName'}
            label={'正则实体'}
            rules={[{ required: true, message: '请输入正则实体名称' }]}
          >
            <Input placeholder={'请输入正则实体名称'} maxLength={150} />
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
                {ruleList?.map((item: any, index: any) => {
                  return (
                    <Tag
                      closable
                      key={index}
                      onClose={(e) => {
                        e.preventDefault();
                        handleClose(item?.entityValueName);
                      }}
                    >
                      <span onDoubleClick={() => editRule(item)}>{item?.entityValueName}</span>
                    </Tag>
                  );
                })}
              </div>
              <Button type="primary" size={'small'} onClick={addRule}>
                新建规则
              </Button>
            </div>
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
