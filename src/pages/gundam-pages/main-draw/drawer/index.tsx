import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import LabelSelect from './components/label-select';
import GlobalVarButton from './components/global-var-button';
import styles from './style.less';
import { BUSINESS_NODE_LIST, LABEL_LIST } from './test';
import { ACTION_LIST } from './const';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const { cref, confirm } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const list1: any = []; // 意图列表

  const list2: any = BUSINESS_NODE_LIST; // 业务流程节点

  const list3: any = LABEL_LIST; // 标签列表

  const [testVal, setTestVal] = useState<any>('');

  const onChange = (val: any) => {
    console.log(val);
    setTestVal(val);
  };

  const onClose = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: () => {
      setVisible(true);
    },
    close: onClose,
  }));

  const saveNode = () => {
    console.log(form.getFieldsValue());
  };

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={saveNode}>
        保存
      </Button>
    </div>
  );

  return (
    <Drawer
      title="节点配置"
      width={820}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
    >
      <Form form={form}>
        <div className={styles['antd-form']}>
          <FormItem
            rules={[{ required: true, message: '请输入流程名称' }]}
            name="name"
            label="节点名称"
            style={{ width: '400px' }}
          >
            <Input placeholder="请输入流程名称" maxLength={150} autoComplete="off" />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: '请输入流程描述' }]}
            name="desc"
            label="节点描述"
            style={{ width: '400px' }}
          >
            <TextArea rows={4} placeholder="请输入流程描述" maxLength={200} />
          </FormItem>
        </div>
        {/* <FormItem name="rules" label="添加规则">
          ---------
        </FormItem> */}

        <div className={styles['title']}>对话回应</div>

        <div className={styles['antd-form']}>
          <div className={styles['title']}>高级配置</div>

          <FormItem name="allow_business" label="允许跳转至业务流程" style={{ width: '400px' }}>
            <Select
              placeholder="请选择允许跳转至业务流程"
              mode="multiple"
              onChange={onChangeRelationSelect}
            >
              {list2.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>

          <FormItem name="ban_business" label="禁止跳转至业务流程" style={{ width: '400px' }}>
            <Select
              placeholder="请选择禁止跳转至业务流程"
              mode="multiple"
              onChange={onChangeRelationBanSelect}
            >
              {list2.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </div>

        {/* 静默处理 */}

        <FormList name="list_1">
          {(fields, { add, remove }) => {
            console.log(fields);
            const addNew = () => {
              let length = fields.length;
              console.log(length);
              add({ response_speak: '', global_var: [], label_var: [] }, length);
            };

            return (
              <div style={{ paddingLeft: '20px' }}>
                <div className={styles['zy-row']}>
                  <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
                    静默处理:
                  </div>
                  <Button type="link" icon={<PlusCircleOutlined />} onClick={addNew}></Button>
                </div>

                {fields.map((field: any, index: number) => (
                  <div
                    key={field.key}
                    className={styles['list-box']}
                    style={{ marginLeft: '30px' }}
                  >
                    <div className={styles['num']}>{index + 1}.</div>
                    <div>
                      <Form.Item
                        name={[field.name, 'response_speak']}
                        fieldKey={[field.fieldKey, 'response_speak']}
                        label="响应话术"
                      >
                        <GlobalVarButton
                          placeholder="请输入响应话术"
                          style={{ width: '400px' }}
                          autoComplete="off"
                        />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'label_var']}
                        fieldKey={[field.fieldKey, 'label_var']}
                        label="选择标签"
                      >
                        <LabelSelect color="orange"></LabelSelect>
                      </Form.Item>
                    </div>

                    <Button
                      icon={<MinusCircleOutlined />}
                      type="link"
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          }}
        </FormList>

        <Space style={{ paddingLeft: '50px', paddingTop: '10px' }}>
          <FormItem
            name="exit_flag_1"
            label="结束挂机"
            valuePropName="checked"
            style={{ width: '200px' }}
          >
            <Checkbox>是否结束挂机</Checkbox>
          </FormItem>

          <FormItem name="action_1" label="动作" style={{ width: '200px' }}>
            <Select placeholder="请选择动作" size="small">
              {ACTION_LIST.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Space>

        {/* 拒绝处理 */}

        <FormList name="list_2">
          {(fields, { add, remove }) => {
            const addNew = () => {
              let length = fields.length;
              add({ response_speak: '', global_var: [], label_var: [] }, length);
            };

            return (
              <div style={{ paddingLeft: '20px' }}>
                <div className={styles['zy-row']}>
                  <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
                    拒绝处理:
                  </div>
                  <Button type="link" icon={<PlusCircleOutlined />} onClick={addNew}></Button>
                </div>

                {fields.map((field: any, index: number) => (
                  <div
                    key={field.key}
                    className={styles['list-box']}
                    style={{ marginLeft: '30px' }}
                  >
                    <div className={styles['num']}>{index + 1}.</div>
                    <div>
                      <Space>
                        <FormItem
                          name={[field.name, 'response_speak']}
                          fieldKey={[field.fieldKey, 'response_speak']}
                          label="响应话术"
                        >
                          <GlobalVarButton
                            placeholder="请输入响应话术"
                            style={{ width: '400px' }}
                            autoComplete="off"
                          />
                        </FormItem>
                      </Space>

                      <FormItem
                        name={[field.name, 'label_var']}
                        fieldKey={[field.fieldKey, 'label_var']}
                        label="选择标签"
                      >
                        <LabelSelect color="orange"></LabelSelect>
                      </FormItem>
                    </div>

                    <Button
                      icon={<MinusCircleOutlined />}
                      type="link"
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          }}
        </FormList>

        <Space style={{ paddingLeft: '50px', paddingTop: '10px' }}>
          <FormItem
            name="exit_flag_2"
            label="结束挂机"
            valuePropName="checked"
            style={{ width: '200px' }}
          >
            <Checkbox>是否结束挂机</Checkbox>
          </FormItem>

          <FormItem name="action_2" label="动作" style={{ width: '200px' }}>
            <Select placeholder="请选择动作" size="small">
              {ACTION_LIST.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Space>

        <div style={{ paddingLeft: '20px' }}>
          <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
            客户未听清处理:
          </div>
          <div style={{ marginLeft: '30px' }}>
            <FormItem name="unclear_wish" label="未听清意图名称" style={{ width: '400px' }}>
              <Select placeholder="请选择未听清意图名称" mode="multiple">
                {list1.map((item: any, index: number) => {
                  return (
                    <Option key={index} value={item.name} opt={item}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>

            <FormItem name="repeat_time" label="重复次数" style={{ width: '400px' }}>
              <InputNumber min={1} />
            </FormItem>

            <Space>
              <FormItem
                name="exit_flag_3"
                label="结束挂机"
                valuePropName="checked"
                style={{ width: '220px' }}
              >
                <Checkbox>是否结束挂机</Checkbox>
              </FormItem>

              <FormItem name="action_3" label="动作" style={{ width: '200px' }}>
                <Select placeholder="请选择动作" size="small">
                  {ACTION_LIST.map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item.name} opt={item}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Space>

            <FormItem name="unclear_response_speak" label="过渡话术">
              <GlobalVarButton
                placeholder="请输入过渡话术"
                style={{ width: '400px' }}
                autoComplete="off"
              />
            </FormItem>

            <FormItem name="unclear_label_var" label="选择标签">
              <LabelSelect color="orange"></LabelSelect>
            </FormItem>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
